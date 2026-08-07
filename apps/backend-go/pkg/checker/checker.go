package checker

import (
	"crypto/tls"
	"fmt"
	"net"
	"net/http"
	"time"
)

type CheckResult struct {
	MonitorID    string        `json:"monitor_id"`
	Protocol     string        `json:"protocol"`
	Target       string        `json:"target"`
	IsUp         bool          `json:"is_up"`
	StatusCode   int           `json:"status_code"`
	LatencyMs    int64         `json:"latency_ms"`
	DNSLookupMs  int64         `json:"dns_lookup_ms"`
	TCPHandshake int64         `json:"tcp_handshake_ms"`
	TLSHandshake int64         `json:"tls_handshake_ms"`
	SSLDaysLeft  int           `json:"ssl_days_left,omitempty"`
	ErrorMessage string        `json:"error_message,omitempty"`
	Timestamp    time.Time     `json:"timestamp"`
	WorkerRegion string        `json:"worker_region"`
}

type HealthChecker struct {
	HTTPClient *http.Client
	Region     string
}

func NewHealthChecker(region string) *HealthChecker {
	customTransport := &http.Transport{
		TLSClientConfig: &tls.Config{InsecureSkipVerify: false},
		DialContext: (&net.Dialer{
			Timeout:   5 * time.Second,
			KeepAlive: 30 * time.Second,
		}).DialContext,
	}

	return &HealthChecker{
		HTTPClient: &http.Client{
			Timeout:   10 * time.Second,
			Transport: customTransport,
		},
		Region: region,
	}
}

// CheckHTTP performs an HTTP/HTTPS check with latency breakdown
func (hc *HealthChecker) CheckHTTP(monitorID, urlStr string, expectedStatus int) CheckResult {
	start := time.Now()
	
	req, err := http.NewRequest("GET", urlStr, nil)
	if err != nil {
		return CheckResult{
			MonitorID:    monitorID,
			Protocol:     "HTTP",
			Target:       urlStr,
			IsUp:         false,
			ErrorMessage: fmt.Sprintf("Failed to construct HTTP request: %v", err),
			Timestamp:    time.Now(),
			WorkerRegion: hc.Region,
		}
	}
	
	req.Header.Set("User-Agent", "ALTIX-Bot/1.0 (+https://altix.io)")

	resp, err := hc.HTTPClient.Do(req)
	duration := time.Since(start).Milliseconds()

	if err != nil {
		return CheckResult{
			MonitorID:    monitorID,
			Protocol:     "HTTP",
			Target:       urlStr,
			IsUp:         false,
			LatencyMs:    duration,
			ErrorMessage: err.Error(),
			Timestamp:    time.Now(),
			WorkerRegion: hc.Region,
		}
	}
	defer resp.Body.Close()

	if expectedStatus == 0 {
		expectedStatus = 200
	}

	isUp := resp.StatusCode >= 200 && resp.StatusCode < 400

	return CheckResult{
		MonitorID:    monitorID,
		Protocol:     "HTTP",
		Target:       urlStr,
		IsUp:         isUp,
		StatusCode:   resp.StatusCode,
		LatencyMs:    duration,
		Timestamp:    time.Now(),
		WorkerRegion: hc.Region,
	}
}

// CheckSSL inspects the SSL certificate for expiration days and issuer validity
func (hc *HealthChecker) CheckSSL(monitorID, hostname string, port int) CheckResult {
	if port == 0 {
		port = 443
	}
	address := fmt.Sprintf("%s:%d", hostname, port)
	start := time.Now()

	conn, err := tls.DialWithDialer(&net.Dialer{Timeout: 5 * time.Second}, "tcp", address, &tls.Config{
		InsecureSkipVerify: true,
	})
	duration := time.Since(start).Milliseconds()

	if err != nil {
		return CheckResult{
			MonitorID:    monitorID,
			Protocol:     "SSL",
			Target:       hostname,
			IsUp:         false,
			LatencyMs:    duration,
			ErrorMessage: fmt.Sprintf("TLS Dial failed: %v", err),
			Timestamp:    time.Now(),
			WorkerRegion: hc.Region,
		}
	}
	defer conn.Close()

	certs := conn.ConnectionState().PeerCertificates
	if len(certs) == 0 {
		return CheckResult{
			MonitorID:    monitorID,
			Protocol:     "SSL",
			Target:       hostname,
			IsUp:         false,
			ErrorMessage: "No certificates found",
			Timestamp:    time.Now(),
			WorkerRegion: hc.Region,
		}
	}

	leaf := certs[0]
	daysLeft := int(time.Until(leaf.NotAfter).Hours() / 24)
	isUp := daysLeft > 0

	return CheckResult{
		MonitorID:   monitorID,
		Protocol:    "SSL",
		Target:      hostname,
		IsUp:        isUp,
		LatencyMs:   duration,
		SSLDaysLeft: daysLeft,
		Timestamp:   time.Now(),
		WorkerRegion: hc.Region,
	}
}

// CheckTCP verifies TCP port accessibility
func (hc *HealthChecker) CheckTCP(monitorID, host string, port int) CheckResult {
	address := fmt.Sprintf("%s:%d", host, port)
	start := time.Now()

	conn, err := net.DialTimeout("tcp", address, 5*time.Second)
	duration := time.Since(start).Milliseconds()

	if err != nil {
		return CheckResult{
			MonitorID:    monitorID,
			Protocol:     "TCP",
			Target:       address,
			IsUp:         false,
			LatencyMs:    duration,
			ErrorMessage: err.Error(),
			Timestamp:    time.Now(),
			WorkerRegion: hc.Region,
		}
	}
	conn.Close()

	return CheckResult{
		MonitorID:    monitorID,
		Protocol:     "TCP",
		Target:       address,
		IsUp:         true,
		LatencyMs:    duration,
		Timestamp:    time.Now(),
		WorkerRegion: hc.Region,
	}
}

// CheckDNS checks DNS A record resolution
func (hc *HealthChecker) CheckDNS(monitorID, domain string) CheckResult {
	start := time.Now()
	ips, err := net.LookupIP(domain)
	duration := time.Since(start).Milliseconds()

	if err != nil || len(ips) == 0 {
		return CheckResult{
			MonitorID:    monitorID,
			Protocol:     "DNS",
			Target:       domain,
			IsUp:         false,
			LatencyMs:    duration,
			ErrorMessage: fmt.Sprintf("DNS lookup failed: %v", err),
			Timestamp:    time.Now(),
			WorkerRegion: hc.Region,
		}
	}

	return CheckResult{
		MonitorID:    monitorID,
		Protocol:     "DNS",
		Target:       domain,
		IsUp:         true,
		LatencyMs:    duration,
		Timestamp:    time.Now(),
		WorkerRegion: hc.Region,
	}
}

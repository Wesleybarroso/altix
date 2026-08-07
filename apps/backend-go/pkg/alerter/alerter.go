package alerter

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"time"
)

type AlertPayload struct {
	MonitorID   string    `json:"monitor_id"`
	MonitorName string    `json:"monitor_name"`
	Target      string    `json:"target"`
	Status      string    `json:"status"` // "DOWN" or "UP"
	ErrorMessage string   `json:"error_message,omitempty"`
	LatencyMs   int64     `json:"latency_ms"`
	Timestamp   time.Time `json:"timestamp"`
}

type AlerterService struct {
	HTTPClient *http.Client
}

func NewAlerterService() *AlerterService {
	return &AlerterService{
		HTTPClient: &http.Client{Timeout: 10 * time.Second},
	}
}

// SendTelegramAlert sends rich markdown messages via Telegram Bot API
func (a *AlerterService) SendTelegramAlert(botToken, chatID string, payload AlertPayload) error {
	url := fmt.Sprintf("https://api.telegram.org/bot%s/sendMessage", botToken)
	
	icon := "🔴"
	if payload.Status == "UP" {
		icon = "🟢"
	}

	text := fmt.Sprintf(
		"%s *ALTIX Alert Notification*\n\n*Monitor:* %s\n*Target:* `%s`\n*Status:* %s\n*Latency:* %d ms\n*Time:* %s",
		icon, payload.MonitorName, payload.Target, payload.Status, payload.LatencyMs, payload.Timestamp.Format("2006-01-02 15:04:05 MST"),
	)
	if payload.ErrorMessage != "" {
		text += fmt.Sprintf("\n*Error:* `%s`", payload.ErrorMessage)
	}

	bodyMap := map[string]string{
		"chat_id":    chatID,
		"text":       text,
		"parse_mode": "Markdown",
	}

	jsonBytes, _ := json.Marshal(bodyMap)
	resp, err := a.HTTPClient.Post(url, "application/json", bytes.NewBuffer(jsonBytes))
	if err != nil {
		return err
	}
	defer resp.Body.Close()
	return nil
}

// SendDiscordAlert sends webhook embed notifications to Discord
func (a *AlerterService) SendDiscordAlert(webhookURL string, payload AlertPayload) error {
	color := 16724784 // Red
	title := "🚨 Incident Detected - Service DOWN"
	if payload.Status == "UP" {
		color = 51283 // Green (#00C853)
		title = "✅ Incident Resolved - Service Operational"
	}

	embed := map[string]interface{}{
		"title":       title,
		"description": fmt.Sprintf("Monitor **%s** (%s) changed state to **%s**", payload.MonitorName, payload.Target, payload.Status),
		"color":       color,
		"fields": []map[string]interface{}{
			{"name": "Target URL", "value": payload.Target, "inline": true},
			{"name": "Latency", "value": fmt.Sprintf("%d ms", payload.LatencyMs), "inline": true},
			{"name": "Error Details", "value": payload.ErrorMessage, "inline": false},
		},
		"timestamp": payload.Timestamp.Format(time.RFC3339),
	}

	body := map[string]interface{}{
		"username": "ALTIX Monitoring",
		"embeds":   []interface{}{embed},
	}

	jsonBytes, _ := json.Marshal(body)
	resp, err := a.HTTPClient.Post(webhookURL, "application/json", bytes.NewBuffer(jsonBytes))
	if err != nil {
		return err
	}
	defer resp.Body.Close()
	return nil
}

// SendSlackAlert sends rich block notifications to Slack Webhook
func (a *AlerterService) SendSlackAlert(webhookURL string, payload AlertPayload) error {
	headerText := fmt.Sprintf(":red_circle: *ALTIX Alert: %s is DOWN*", payload.MonitorName)
	if payload.Status == "UP" {
		headerText = fmt.Sprintf(":large_green_circle: *ALTIX Alert: %s is RECOVERED*", payload.MonitorName)
	}

	body := map[string]interface{}{
		"text": headerText,
		"blocks": []map[string]interface{}{
			{
				"type": "section",
				"text": map[string]string{
					"type": "mrkdwn",
					"text": headerText,
				},
			},
			{
				"type": "section",
				"fields": []map[string]string{
					{"type": "mrkdwn", "text": fmt.Sprintf("*Target:*\n%s", payload.Target)},
					{"type": "mrkdwn", "text": fmt.Sprintf("*Response Time:*\n%d ms", payload.LatencyMs)},
				},
			},
		},
	}

	jsonBytes, _ := json.Marshal(body)
	resp, err := a.HTTPClient.Post(webhookURL, "application/json", bytes.NewBuffer(jsonBytes))
	if err != nil {
		return err
	}
	defer resp.Body.Close()
	return nil
}

// SendWebhookAlert posts a structured JSON payload to custom user webhooks
func (a *AlerterService) SendWebhookAlert(webhookURL string, payload AlertPayload) error {
	jsonBytes, _ := json.Marshal(payload)
	resp, err := a.HTTPClient.Post(webhookURL, "application/json", bytes.NewBuffer(jsonBytes))
	if err != nil {
		return err
	}
	defer resp.Body.Close()
	return nil
}

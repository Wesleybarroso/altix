package main

import (
	"context"
	"fmt"
	"log"
	"os"
	"time"

	"github.com/altix/backend-go/pkg/checker"
	"github.com/altix/backend-go/pkg/redis"
)

func main() {
	log.Println("⚡ Starting ALTIX Distributed Health Checker Daemon (Go Engine)...")

	redisAddr := os.Getenv("REDIS_URL")
	if redisAddr == "" {
		redisAddr = "localhost:6379"
	}

	redisClient, err := redis.NewRedisClient(redisAddr)
	if err != nil {
		log.Printf("⚠️ Redis connection warning (%s): %v. Running in standalone mode.", redisAddr, err)
	} else {
		log.Println("✅ Connected to Redis Pub/Sub Event Stream.")
	}

	hc := checker.NewHealthChecker("us-east-1")

	// Demo sample monitors scheduled for verification
	sampleMonitors := []struct {
		ID       string
		Protocol string
		Target   string
	}{
		{ID: "mon-1", Protocol: "HTTP", Target: "https://api.github.com"},
		{ID: "mon-2", Protocol: "SSL", Target: "vercel.com"},
		{ID: "mon-3", Protocol: "DNS", Target: "cloudflare.com"},
		{ID: "mon-4", Protocol: "TCP", Target: "1.1.1.1:53"},
	}

	log.Printf("🚀 Worker pool initialized with region %s. Monitoring %d targets.", hc.Region, len(sampleMonitors))

	ticker := time.NewTicker(3 * time.Second)
	defer ticker.Stop()

	for range ticker.C {
		ctx := context.Background()
		for _, m := range sampleMonitors {
			var result checker.CheckResult

			switch m.Protocol {
			case "HTTP":
				result = hc.CheckHTTP(m.ID, m.Target, 200)
			case "SSL":
				result = hc.CheckSSL(m.ID, m.Target, 443)
			case "DNS":
				result = hc.CheckDNS(m.ID, m.Target)
			case "TCP":
				result = hc.CheckTCP(m.ID, "1.1.1.1", 53)
			}

			statusStr := "UP 🟢"
			if !result.IsUp {
				statusStr = "DOWN 🔴"
			}
			fmt.Printf("[%s] [%s] %s (%s) -> %d ms | %s\n",
				time.Now().Format("15:04:05.000"),
				result.Protocol,
				m.Target,
				statusStr,
				result.LatencyMs,
				result.WorkerRegion,
			)

			if redisClient != nil {
				_ = redisClient.PublishCheckResult(ctx, result)
			}
		}
	}
}

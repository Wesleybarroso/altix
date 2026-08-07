package redis

import (
	"context"
	"encoding/json"
	"fmt"
	"github.com/altix/backend-go/pkg/checker"
	"github.com/go-redis/redis/v8"
)

type RedisClient struct {
	Client *redis.Client
}

func NewRedisClient(addr string) (*RedisClient, error) {
	rdb := redis.NewClient(&redis.Options{
		Addr:     addr,
		Password: "", // no password set
		DB:       0,  // use default DB
	})

	ctx := context.Background()
	_, err := rdb.Ping(ctx).Result()
	if err != nil {
		return nil, err
	}

	return &RedisClient{Client: rdb}, nil
}

func (r *RedisClient) PublishCheckResult(ctx context.Context, result checker.CheckResult) error {
	jsonBytes, err := json.Marshal(result)
	if err != nil {
		return err
	}

	// Publish to global pub/sub channel for sub-second WS broadcast
	err = r.Client.Publish(ctx, "altix:check_events", jsonBytes).Err()
	if err != nil {
		return fmt.Errorf("redis publish error: %v", err)
	}

	// Cache latest status in Redis hash
	hashKey := fmt.Sprintf("altix:monitor:%s:latest", result.MonitorID)
	r.Client.HSet(ctx, hashKey, map[string]interface{}{
		"is_up":       result.IsUp,
		"latency_ms":  result.LatencyMs,
		"status_code": result.StatusCode,
		"timestamp":   result.Timestamp.Unix(),
	})

	return nil
}

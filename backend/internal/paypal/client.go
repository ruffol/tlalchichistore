package paypal

import (
	"bytes"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
)

type Client struct {
	clientID     string
	clientSecret string
	apiURL       string
	http         *http.Client
}

func New(clientID, clientSecret, apiURL string) *Client {
	return &Client{
		clientID:     clientID,
		clientSecret: clientSecret,
		apiURL:       apiURL,
		http:         &http.Client{},
	}
}

func (c *Client) GetAccessToken() (string, error) {
	auth := base64.StdEncoding.EncodeToString([]byte(c.clientID + ":" + c.clientSecret))

	body := []byte("grant_type=client_credentials")
	req, err := http.NewRequest("POST", c.apiURL+"/v1/oauth2/token", bytes.NewReader(body))
	if err != nil {
		return "", fmt.Errorf("create auth request: %w", err)
	}
	req.Header.Set("Authorization", "Basic "+auth)
	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")

	resp, err := c.http.Do(req)
	if err != nil {
		return "", fmt.Errorf("paypal auth: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != 200 {
		b, _ := io.ReadAll(resp.Body)
		return "", fmt.Errorf("paypal auth failed: %d %s", resp.StatusCode, string(b))
	}

	var result struct {
		AccessToken string `json:"access_token"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return "", fmt.Errorf("decode auth response: %w", err)
	}

	return result.AccessToken, nil
}

type OrderItem struct {
	Name        string  `json:"name"`
	UnitAmount  float64 `json:"unit_amount"`
	Quantity    int     `json:"quantity"`
	Description string  `json:"description,omitempty"`
}

type CreateOrderInput struct {
	Items    []OrderItem
	Subtotal float64
	Shipping float64
	Total    float64
}

func (c *Client) CreateOrder(input CreateOrderInput) (string, error) {
	token, err := c.GetAccessToken()
	if err != nil {
		return "", err
	}

	var items []map[string]any
	for _, item := range input.Items {
		items = append(items, map[string]any{
			"name":        item.Name,
			"unit_amount": map[string]string{"currency_code": "USD", "value": fmt.Sprintf("%.2f", item.UnitAmount)},
			"quantity":    fmt.Sprintf("%d", item.Quantity),
			"description": item.Description,
			"category":    "PHYSICAL_GOODS",
		})
	}

	body := map[string]any{
		"intent": "CAPTURE",
		"purchase_units": []map[string]any{
			{
				"items": items,
				"amount": map[string]any{
					"currency_code": "USD",
					"value":         fmt.Sprintf("%.2f", input.Total),
					"breakdown": map[string]any{
						"item_total": map[string]string{"currency_code": "USD", "value": fmt.Sprintf("%.2f", input.Subtotal)},
						"shipping":   map[string]string{"currency_code": "USD", "value": fmt.Sprintf("%.2f", input.Shipping)},
					},
				},
			},
		},
	}

	return c.post(token, "/v2/checkout/orders", body)
}

func (c *Client) CaptureOrder(orderID string) (map[string]any, error) {
	token, err := c.GetAccessToken()
	if err != nil {
		return nil, err
	}

	resp, err := c.do("POST", token, fmt.Sprintf("/v2/checkout/orders/%s/capture", orderID), nil)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != 201 && resp.StatusCode != 200 {
		b, _ := io.ReadAll(resp.Body)
		return nil, fmt.Errorf("paypal capture failed: %d %s", resp.StatusCode, string(b))
	}

	var result map[string]any
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return nil, fmt.Errorf("decode capture response: %w", err)
	}

	return result, nil
}

func (c *Client) post(token, path string, body any) (string, error) {
	resp, err := c.do("POST", token, path, body)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	if resp.StatusCode != 200 && resp.StatusCode != 201 {
		b, _ := io.ReadAll(resp.Body)
		return "", fmt.Errorf("paypal request failed: %d %s", resp.StatusCode, string(b))
	}

	var result struct {
		ID string `json:"id"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return "", fmt.Errorf("decode response: %w", err)
	}

	return result.ID, nil
}

func (c *Client) do(method, token, path string, body any) (*http.Response, error) {
	var reqBody io.Reader
	if body != nil {
		b, err := json.Marshal(body)
		if err != nil {
			return nil, fmt.Errorf("marshal request: %w", err)
		}
		reqBody = bytes.NewReader(b)
	}

	req, err := http.NewRequest(method, c.apiURL+path, reqBody)
	if err != nil {
		return nil, fmt.Errorf("create request: %w", err)
	}
	req.Header.Set("Authorization", "Bearer "+token)
	req.Header.Set("Content-Type", "application/json")

	return c.http.Do(req)
}

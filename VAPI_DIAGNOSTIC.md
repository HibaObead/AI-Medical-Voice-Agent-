# Vapi Ejection Error Diagnostic Guide

## Current Issue: "Meeting ended due to ejection"

This error indicates the Vapi server is forcibly terminating your calls. This is a **server-side issue** requiring account-level resolution.

## Step-by-Step Diagnostic Process

### Step 1: Test Your Configuration
1. Click **"Debug Config"** button
2. Check console for configuration validation
3. Verify all ✅ checks pass

### Step 2: Test Your API Key
1. Click **"Test API Key"** button
2. Check if API key is valid
3. Look for account information in console

### Step 3: Check Account Status
1. Click **"Check Account Status"** button
2. Review your Vapi dashboard
3. Check usage limits and billing status

## Common Solutions

### Solution 1: Account Limits
**Symptoms:**
- Ejection error persists
- API key test passes
- Configuration test passes

**Action:**
1. Go to [console.vapi.ai](https://console.vapi.ai)
2. Check usage dashboard
3. Upgrade plan or wait for monthly reset

### Solution 2: Billing Issues
**Symptoms:**
- API key test fails
- Account shows billing problems

**Action:**
1. Add payment method
2. Purchase credits
3. Contact Vapi billing support

### Solution 3: Service Issues
**Symptoms:**
- All tests pass
- Error occurs intermittently

**Action:**
1. Wait 15-30 minutes
2. Check Vapi status page
3. Try again later

## Testing Commands

### Test API Key (Manual)
```bash
curl -H "Authorization: Bearer YOUR_API_KEY" \
     https://api.vapi.ai/assistant
```

### Expected Response
```json
{
  "assistants": [...],
  "total": 0
}
```

## Prevention Steps

1. **Monitor Usage**: Check dashboard regularly
2. **Set Alerts**: Configure usage notifications
3. **Keep Credits**: Maintain sufficient balance
4. **Test Regularly**: Validate configuration periodically

## Contact Support

If all tests pass but ejection persists:
1. Contact Vapi support with error details
2. Include call client ID: `17559770781440.663930177896965`
3. Provide account information and error logs

# Vapi Troubleshooting Guide

## "Meeting ended due to ejection" Error

This error indicates that the Vapi server forcibly terminated your call. This is a **server-side issue** and requires checking your Vapi account configuration.

### Immediate Steps

1. **Wait 10-15 minutes** before trying again
2. **Check your Vapi account status** at [console.vapi.ai](https://console.vapi.ai)
3. **Verify your API key** is valid and has proper permissions
4. **Check your billing status** and ensure you have sufficient credits

### Common Causes & Solutions

#### 1. Account Usage Limits
- **Cause**: You've exceeded your monthly call limits or concurrent call limits
- **Solution**: 
  - Check your usage dashboard
  - Upgrade your plan if needed
  - Wait for limits to reset

#### 2. Billing Issues
- **Cause**: Insufficient credits or billing problems
- **Solution**:
  - Add payment method
  - Purchase more credits
  - Contact billing support

#### 3. Rate Limiting
- **Cause**: Too many calls in a short period
- **Solution**:
  - Wait 5-10 minutes between calls
  - Implement call throttling
  - Check rate limit documentation

#### 4. Account Suspension
- **Cause**: Account may be suspended due to policy violations
- **Solution**:
  - Contact Vapi support
  - Review terms of service
  - Resolve any outstanding issues

#### 5. Service Issues
- **Cause**: Temporary Vapi service problems
- **Solution**:
  - Check Vapi status page
  - Wait for service to be restored
  - Try again later

### Configuration Checklist

- [ ] API key is valid and active
- [ ] API key has proper permissions
- [ ] Account is in good standing
- [ ] Sufficient credits available
- [ ] Not exceeding usage limits
- [ ] Voice IDs are valid ElevenLabs IDs
- [ ] Environment variables are set correctly

### Testing Your Setup

1. **Test API Key**:
   ```bash
   curl -H "Authorization: Bearer YOUR_API_KEY" \
        https://api.vapi.ai/assistant
   ```

2. **Check Account Status**:
   - Visit [console.vapi.ai](https://console.vapi.ai)
   - Review usage dashboard
   - Check billing status

3. **Verify Voice IDs**:
   - Ensure voice IDs in `shared/list.tsx` are valid ElevenLabs voice IDs
   - Test voice IDs with ElevenLabs API

### Getting Help

1. **Vapi Documentation**: [docs.vapi.ai](https://docs.vapi.ai)
2. **Vapi Support**: Contact through console.vapi.ai
3. **Community**: Check Vapi Discord or forums
4. **Status Page**: Check for service outages

### Prevention

1. **Monitor Usage**: Regularly check your usage dashboard
2. **Set Alerts**: Configure usage alerts in your Vapi dashboard
3. **Implement Retry Logic**: Add exponential backoff for failed calls
4. **Test Regularly**: Test your integration periodically
5. **Keep Credits**: Maintain sufficient credits for your usage

## Other Common Errors

### Empty Error Object `{}`
- **Cause**: WebRTC connection failure
- **Solution**: Check browser compatibility, HTTPS, and network settings

### 400 Bad Request
- **Cause**: Invalid API key or configuration
- **Solution**: Verify API key and configuration parameters

### Generic Error Actions
- **Cause**: Vapi service error without specific details
- **Solution**: Check service status and try again later

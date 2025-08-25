# Vapi Setup Guide

## Environment Variables Required

Create a `.env.local` file in the root of your project with the following variables:

```env
# Vapi Configuration
NEXT_PUBLIC_VAPI_API_KEY=your_vapi_api_key_here

# OpenAI Configuration (if needed)
OPENAI_API_KEY=your_openai_api_key_here

# Assembly AI Configuration (if needed)
ASSEMBLY_AI_API_KEY=your_assembly_ai_api_key_here

# ElevenLabs Configuration (if needed)
ELEVENLABS_API_KEY=your_elevenlabs_api_key_here
```

## Getting Your Vapi API Key

1. Go to [Vapi Dashboard](https://console.vapi.ai/)
2. Sign up or log in to your account
3. Navigate to the API Keys section
4. Create a new API key
5. Copy the API key and paste it in your `.env.local` file

## ElevenLabs Voice Configuration

The current voice IDs in your code are using voice names instead of actual ElevenLabs voice IDs. You need to:

1. Go to [ElevenLabs Voice Library](https://elevenlabs.io/voice-library)
2. Find the voices you want to use (will, chris, sarge, etc.)
3. Get the actual voice IDs (they look like: `21m00Tcm4TlvDq8ikWAM`)
4. Update the `voiceId` values in `shared/list.tsx`

Example of correct voice ID format:
```typescript
voiceId: "21m00Tcm4TlvDq8ikWAM", // Actual ElevenLabs voice ID
```

## Common Issues and Solutions

### 400 Bad Request Error
- **Cause**: Invalid or missing API key
- **Solution**: Ensure your `NEXT_PUBLIC_VAPI_API_KEY` is correctly set and valid

### Unhandled Error in Vapi Client
- **Cause**: Incorrect configuration or missing dependencies
- **Solution**: 
  1. Check that all environment variables are set
  2. Ensure you have the latest version of `@vapi-ai/web`
  3. Verify your voice ID is valid for ElevenLabs

### Voice Configuration Issues
- **Cause**: Invalid voice ID or missing ElevenLabs API key
- **Solution**: 
  1. Verify your ElevenLabs voice ID is correct (use actual IDs, not names)
  2. Ensure you have a valid ElevenLabs API key if required
  3. Check that the voice IDs in `shared/list.tsx` are valid ElevenLabs voice IDs

### "Voice configuration not available" Error
- **Cause**: Missing or invalid voiceId in the selected doctor
- **Solution**: 
  1. Check that the selected doctor has a valid voiceId
  2. Verify the voiceId is a valid ElevenLabs voice ID
  3. Ensure the voiceId is not undefined or null

### "Meeting has ended" Error
- **Cause**: This error typically occurs when:
  1. The Vapi service encounters a temporary issue
  2. There are service limits or rate limiting
  3. Network connectivity issues
  4. Invalid configuration parameters
- **Solution**: 
  1. The app now includes automatic retry logic (up to 3 attempts)
  2. Wait a few moments and try again manually
  3. Check your Vapi account status and billing
  4. Verify all configuration parameters are correct
  5. Check your internet connection

### "Call was ejected" Error
- **Cause**: Similar to "Meeting has ended" but indicates the call was forcibly terminated
- **Solution**: 
  1. Check your Vapi service limits
  2. Verify your API key has sufficient permissions
  3. Ensure your account is in good standing
  4. Try again after a short delay

### Empty Error Object or WebRTC Connection Issues
- **Cause**: This typically occurs when:
  1. WebRTC connection fails to establish
  2. Network connectivity issues (firewall, proxy, etc.)
  3. Browser doesn't support required WebRTC features
  4. Microphone/camera permissions not granted
  5. HTTPS required for WebRTC (not HTTP)
- **Solution**: 
  1. Ensure you're using HTTPS in production
  2. Check browser console for WebRTC errors
  3. Grant microphone permissions when prompted
  4. Check firewall/proxy settings
  5. Try a different browser (Chrome, Firefox, Safari)
  6. Check if your network blocks WebRTC traffic

### Generic Error Action Without Message
- **Cause**: Vapi service error without specific error details
- **Solution**: 
  1. Check Vapi service status
  2. Verify API key permissions
  3. Try again after a short delay
  4. Check Vapi dashboard for any service issues

### "Meeting ended due to ejection" Error
- **Cause**: This is a server-side error that typically occurs when:
  1. **Account Limits**: You've exceeded your Vapi service limits or quotas
  2. **Billing Issues**: Your Vapi account has billing problems or insufficient credits
  3. **Service Issues**: Vapi service is experiencing temporary problems
  4. **Configuration Problems**: Invalid API key or configuration parameters
  5. **Rate Limiting**: Too many calls in a short period
  6. **Account Suspension**: Your account may be suspended or restricted
- **Solution**: 
  1. **Check Vapi Dashboard**: Go to [console.vapi.ai](https://console.vapi.ai) and verify:
     - Account status and billing
     - Usage limits and quotas
     - API key validity and permissions
  2. **Check Service Status**: Look for any service announcements or outages
  3. **Wait and Retry**: Ejection errors are often temporary - wait 5-10 minutes and try again
  4. **Contact Support**: If the issue persists, contact Vapi support with your error details
  5. **Check API Key**: Ensure your API key is valid and has the correct permissions
  6. **Review Usage**: Check if you've exceeded any service limits

### Immediate Steps for Ejection Errors
1. **Don't Retry Immediately**: Wait at least 5 minutes before trying again
2. **Check Account Status**: Verify your Vapi account is in good standing
3. **Monitor Usage**: Check if you're approaching or exceeding limits
4. **Verify Configuration**: Ensure all configuration parameters are correct
5. **Check Network**: Ensure stable internet connection

## Testing Your Setup

1. Start your development server: `npm run dev`
2. Navigate to a medical agent session
3. Check the browser console for any error messages
4. Try starting a call to test the Vapi integration

## Debugging Steps

1. **Check Environment Variables**: Ensure `NEXT_PUBLIC_VAPI_API_KEY` is set
2. **Verify Voice IDs**: Make sure all voice IDs in `shared/list.tsx` are valid ElevenLabs voice IDs
3. **Check Console Logs**: Look for specific error messages in the browser console
4. **Test API Key**: Try making a simple API call to verify your Vapi API key is working

## Additional Resources

- [Vapi Documentation](https://docs.vapi.ai/)
- [Vapi Web SDK](https://docs.vapi.ai/web-sdk)
- [ElevenLabs Voice Library](https://elevenlabs.io/voice-library)
- [ElevenLabs API Documentation](https://docs.elevenlabs.io/)

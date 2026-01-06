# Deployment

## Vercel (Recommended)

```bash
npm i -g vercel
vercel
```

Add environment variables in Vercel dashboard:

- `OPENROUTER_API_KEY`
- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`
- `NEXT_PUBLIC_APP_URL`

## Environment Variables

Get from:

- OpenRouter: https://openrouter.ai/keys
- Upstash: https://upstash.com

## LinkedIn Scraping

Current implementation is for demo only.

For production:

- Use LinkedIn API (recommended)
- Use scraping service (ScrapingBee, Apify)
- Current approach may break or get blocked

## Post-deployment

- Test with real LinkedIn profile
- Monitor Vercel Analytics
- Check Upstash dashboard
- Monitor OpenRouter usage

## Cost Estimate

Free tier (1,000 users/month):

- Vercel: $0
- Upstash: $0
- OpenRouter: ~$10-20

Total: ~$10-20/month

## Security

- Never commit `.env.local`
- Rotate API keys periodically
- Monitor for abuse
- Add CAPTCHA if needed

## Legal

Consider adding:

- Privacy Policy
- Terms of Service
- GDPR compliance (if EU users)
- Disclaimer about LinkedIn scraping

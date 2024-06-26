import { AppConfig } from '@config';
import { UrlBaseOutputDto } from '@modules/url/dtos/output';

export function addShortenedUrlToUrl(url: UrlBaseOutputDto): UrlBaseOutputDto {
  const clonedUrl = structuredClone(url);

  const parsedClonedUrl = new Map();

  for (const [key, value] of Object.entries(clonedUrl)) {
    parsedClonedUrl.set(key, value);

    if (key === 'shortenedPath') {
      parsedClonedUrl.set(
        'shortenedUrl',
        `${AppConfig.getOrThrow('APP_BASE_URL')}/${url.shortenedPath}`,
      );
    }
  }

  return Object.fromEntries(parsedClonedUrl);
}

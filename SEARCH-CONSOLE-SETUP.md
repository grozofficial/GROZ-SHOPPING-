# GROZ — Google Search Console setup

1. Upload the website to your real domain.
2. Replace `YOUR-DOMAIN.example` in `sitemap.xml`, `robots.txt`, and each page's canonical URL with the real domain.
3. Open Google Search Console and add the domain/property.
4. Complete Google's ownership verification (DNS is usually best; HTML/meta verification also works).
5. Submit `https://YOUR-REAL-DOMAIN/sitemap.xml` in Search Console.
6. Use URL Inspection → Request indexing for the homepage and important pages.

The site already includes titles, descriptions, canonical tags, robots directives, sitemap and Organization structured data. Search Console does not itself make a site rank; indexing and ranking depend on Google's crawling and content quality.

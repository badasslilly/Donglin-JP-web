import { fetchAPI } from "@/utils/fetch-api"
import qs from "qs"

export function getStrapiURL() {
  return process.env.STRAPI_API_URL ?? "http://localhost:1337"
}

const BASE_URL = getStrapiURL();
const homePageQuery = qs.stringify({
  "populate": {
    "hero_slides": {
      "populate": "image"
    },
    "intro": {
      "populate": [
        "crest",
        "kanji_vertical"
      ]
    },
    "promos": {
      "populate": "images"
    }
  }
});

const globalSettingQuery = qs.stringify({
  "fields": [
    "address",
    "opening_hours",
    "phone",
    "email"
  ],
  "populate": {
    "nav_items": {
      "fields": [
        "label",
        "href"
      ]
    },
    "socials": {
      "fields": [
        "platform",
        "url"
      ]
    }
}
});

export async function getLanguages() {
  const path = "/i18n/locales";
  const url = new URL(path, BASE_URL);

  return await fetchAPI(url.href, { method: "GET" });
}

export async function getHomePage(locale: string = 'ja') {
  const path = "/api/home-page";
  const url = new URL(path, BASE_URL);
  url.search = `locale=${locale}&${homePageQuery}`;

  return await fetchAPI(url.href, { method: "GET" });
}

export async function getGlobalSettings(locale: string = 'ja') {
  const path = "/api/global";
  const url = new URL(path, BASE_URL);
  url.search = `locale=${locale}&${globalSettingQuery}`;
  return fetchAPI(url.href, { method: "GET" });
}





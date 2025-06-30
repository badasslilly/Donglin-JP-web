import type { Schema, Struct } from '@strapi/strapi';

export interface SectionsIntro extends Struct.ComponentSchema {
  collectionName: 'components_intro';
  info: {
    displayName: 'Intro';
  };
  attributes: {
    crest: Schema.Attribute.Media;
    description: Schema.Attribute.RichText & Schema.Attribute.Required;
    kanji_vertical: Schema.Attribute.Media;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SectionsPromo extends Struct.ComponentSchema {
  collectionName: 'components_promo';
  info: {
    displayName: 'Promo Section';
  };
  attributes: {
    body: Schema.Attribute.RichText & Schema.Attribute.Required;
    cta_label: Schema.Attribute.String;
    cta_link: Schema.Attribute.String;
    heading: Schema.Attribute.String & Schema.Attribute.Required;
    images: Schema.Attribute.Media<undefined, true>;
  };
}

export interface SectionsSlide extends Struct.ComponentSchema {
  collectionName: 'components_slide';
  info: {
    displayName: 'Slide';
  };
  attributes: {
    alt: Schema.Attribute.String;
    image: Schema.Attribute.Media & Schema.Attribute.Required;
  };
}

export interface SharedLink extends Struct.ComponentSchema {
  collectionName: 'components_shared_link';
  info: {
    displayName: 'Link';
  };
  attributes: {
    href: Schema.Attribute.String & Schema.Attribute.Required;
    label: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedSocialLink extends Struct.ComponentSchema {
  collectionName: 'components_social_link';
  info: {
    displayName: 'Social Link';
  };
  attributes: {
    platform: Schema.Attribute.Enumeration<['facebook', 'instagram', 'x']>;
    url: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'sections.intro': SectionsIntro;
      'sections.promo': SectionsPromo;
      'sections.slide': SectionsSlide;
      'shared.link': SharedLink;
      'shared.social-link': SharedSocialLink;
    }
  }
}

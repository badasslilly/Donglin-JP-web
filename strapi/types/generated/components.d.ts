import type { Schema, Struct } from '@strapi/strapi';

export interface BlocksArticle extends Struct.ComponentSchema {
  collectionName: 'components_blocks_articles';
  info: {
    displayName: 'Article';
  };
  attributes: {
    date: Schema.Attribute.Date;
    details: Schema.Attribute.Blocks;
    headline: Schema.Attribute.String;
    media: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
  };
}

export interface BlocksContentSection extends Struct.ComponentSchema {
  collectionName: 'components_blocks_content_sections';
  info: {
    displayName: 'Content Section';
  };
  attributes: {
    blocks: Schema.Attribute.Component<'blocks.content-subsection', true>;
    section_title: Schema.Attribute.String;
  };
}

export interface BlocksContentSubsection extends Struct.ComponentSchema {
  collectionName: 'components_blocks_content_subsections';
  info: {
    displayName: 'content subsection';
  };
  attributes: {
    image: Schema.Attribute.Media<'images'>;
    intro: Schema.Attribute.Text;
    subtitle: Schema.Attribute.String;
  };
}

export interface BlocksHistoryItem extends Struct.ComponentSchema {
  collectionName: 'components_blocks_history_items';
  info: {
    displayName: 'History Item';
  };
  attributes: {
    brief: Schema.Attribute.Text;
    era: Schema.Attribute.String;
  };
}

export interface BlocksVideoBlock extends Struct.ComponentSchema {
  collectionName: 'components_blocks_video_blocks';
  info: {
    displayName: 'Video Block';
  };
  attributes: {
    description: Schema.Attribute.Text;
    posterUrl: Schema.Attribute.Media<'images'>;
    title: Schema.Attribute.String;
    videoUrl: Schema.Attribute.String;
  };
}

export interface SectionsButton extends Struct.ComponentSchema {
  collectionName: 'components_sections_buttons';
  info: {
    displayName: 'Button';
  };
  attributes: {
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SectionsHero extends Struct.ComponentSchema {
  collectionName: 'components_sections_heroes';
  info: {
    displayName: 'Hero';
  };
  attributes: {
    bg_image: Schema.Attribute.Media<'images'>;
    heading: Schema.Attribute.Component<'sections.section-title', false>;
  };
}

export interface SectionsHistorySection extends Struct.ComponentSchema {
  collectionName: 'components_sections_history_sections';
  info: {
    displayName: 'History Section';
  };
  attributes: {
    content: Schema.Attribute.Component<'blocks.history-item', true>;
    section_name: Schema.Attribute.String;
  };
}

export interface SectionsPageTab extends Struct.ComponentSchema {
  collectionName: 'components_sections_page_tabs';
  info: {
    displayName: 'Page Tab';
  };
  attributes: {
    href: Schema.Attribute.String;
    label: Schema.Attribute.String;
    order: Schema.Attribute.Integer;
  };
}

export interface SectionsSectionTitle extends Struct.ComponentSchema {
  collectionName: 'components_sections_section_titles';
  info: {
    displayName: 'Section Title';
  };
  attributes: {
    title_en: Schema.Attribute.String & Schema.Attribute.Required;
    title_ja: Schema.Attribute.String & Schema.Attribute.Required;
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

export interface SectionsTextWithImg extends Struct.ComponentSchema {
  collectionName: 'components_sections_text_with_imgs';
  info: {
    displayName: 'Text Block';
  };
  attributes: {
    headline: Schema.Attribute.String;
    image: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    intro: Schema.Attribute.Blocks & Schema.Attribute.Required;
  };
}

export interface SharedCategory extends Struct.ComponentSchema {
  collectionName: 'components_shared_categories';
  info: {
    displayName: 'Category';
  };
  attributes: {
    content: Schema.Attribute.Component<'sections.text-with-img', true>;
    headline: Schema.Attribute.String;
  };
}

export interface SharedLink extends Struct.ComponentSchema {
  collectionName: 'components_shared_link';
  info: {
    displayName: 'Link';
  };
  attributes: {
    href: Schema.Attribute.String & Schema.Attribute.Required;
    isExternal: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
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

export interface SharedTextWithImg extends Struct.ComponentSchema {
  collectionName: 'components_shared_text_with_imgs';
  info: {
    displayName: 'Text with Img';
  };
  attributes: {
    description: Schema.Attribute.Blocks;
    img: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'blocks.article': BlocksArticle;
      'blocks.content-section': BlocksContentSection;
      'blocks.content-subsection': BlocksContentSubsection;
      'blocks.history-item': BlocksHistoryItem;
      'blocks.video-block': BlocksVideoBlock;
      'sections.button': SectionsButton;
      'sections.hero': SectionsHero;
      'sections.history-section': SectionsHistorySection;
      'sections.page-tab': SectionsPageTab;
      'sections.section-title': SectionsSectionTitle;
      'sections.slide': SectionsSlide;
      'sections.text-with-img': SectionsTextWithImg;
      'shared.category': SharedCategory;
      'shared.link': SharedLink;
      'shared.social-link': SharedSocialLink;
      'shared.text-with-img': SharedTextWithImg;
    }
  }
}

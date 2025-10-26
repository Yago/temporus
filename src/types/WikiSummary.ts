export type WikiSummary = {
  type: string;
  title: string;
  displaytitle: string;
  namespace: Namespace;
  wikibase_item: string;
  titles: Titles;
  pageid: number;
  thumbnail: Thumbnail;
  originalimage: Originalimage;
  lang: string;
  dir: string;
  revision: string;
  tid: string;
  timestamp: string;
  description: string;
  description_source: string;
  content_urls: ContentUrls;
  extract: string;
  extract_html: string;
};

type Namespace = {
  id: number;
  text: string;
};

type Titles = {
  canonical: string;
  normalized: string;
  display: string;
};

type Thumbnail = {
  source: string;
  width: number;
  height: number;
};

type Originalimage = {
  source: string;
  width: number;
  height: number;
};

type ContentUrls = {
  desktop: Desktop;
  mobile: Mobile;
};

type Desktop = {
  page: string;
  revisions: string;
  edit: string;
  talk: string;
};

type Mobile = {
  page: string;
  revisions: string;
  edit: string;
  talk: string;
};

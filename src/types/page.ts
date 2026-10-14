export interface BasePageConfig {
    type: 'about' | 'publication' | 'text' | 'cv';
    title: string;
    description?: string;
}

export interface PublicationPageConfig extends BasePageConfig {
    type: 'publication';
    source: string;
    scholarUrl?: string;
}

export interface TextPageConfig extends BasePageConfig {
    type: 'text';
    source: string;
}

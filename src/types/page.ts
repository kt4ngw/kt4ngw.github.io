export interface BasePageConfig {
    type: 'about' | 'publication' | 'text' | 'list' | 'cv';
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

export interface ListItem {
    date: string;
    content: string;
}

export interface ListSection {
    title?: string;
    items: ListItem[];
}

export interface ListPageConfig extends BasePageConfig {
    type: 'list';
    sections: ListSection[];
}

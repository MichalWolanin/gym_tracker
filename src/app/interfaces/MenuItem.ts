export interface MenuItem { 
    label?: string;
    icon?: string;
    image?: string;
    root?: boolean;
    items?: MenuItem[] | MenuItem[];
}

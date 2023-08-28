export interface FileDialogResult {
    canceled: boolean;
    filePaths: string[];
    bookmarks?: string[]
}
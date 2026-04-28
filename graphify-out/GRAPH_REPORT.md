# Graph Report - src  (2026-04-28)

## Corpus Check
- Corpus is ~36,963 words - fits in a single context window. You may not need a graph.

## Summary
- 550 nodes · 547 edges · 79 communities detected
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 15 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Auth Actions & Email Validator|Auth Actions & Email Validator]]
- [[_COMMUNITY_Publication API|Publication API]]
- [[_COMMUNITY_Mail API (DraftsThreads)|Mail API (Drafts/Threads)]]
- [[_COMMUNITY_Publication Hooks & Form|Publication Hooks & Form]]
- [[_COMMUNITY_Mail Category Hooks & Form|Mail Category Hooks & Form]]
- [[_COMMUNITY_Mail Folder API|Mail Folder API]]
- [[_COMMUNITY_RBAC Permissions|RBAC Permissions]]
- [[_COMMUNITY_Sidebar UI|Sidebar UI]]
- [[_COMMUNITY_Auth Proxy & JWT Refresh|Auth Proxy & JWT Refresh]]
- [[_COMMUNITY_Select UI Primitive|Select UI Primitive]]
- [[_COMMUNITY_Mail Recipient API|Mail Recipient API]]
- [[_COMMUNITY_Mail Type API|Mail Type API]]
- [[_COMMUNITY_Document Type API|Document Type API]]
- [[_COMMUNITY_Menubar UI Primitive|Menubar UI Primitive]]
- [[_COMMUNITY_Document Type Hooks & Form|Document Type Hooks & Form]]
- [[_COMMUNITY_Mail Type Hooks & Form|Mail Type Hooks & Form]]
- [[_COMMUNITY_Quick Message Hooks & Form|Quick Message Hooks & Form]]
- [[_COMMUNITY_Mail Category API|Mail Category API]]
- [[_COMMUNITY_Mail Attachment API|Mail Attachment API]]
- [[_COMMUNITY_Pagination & Query State Hooks|Pagination & Query State Hooks]]
- [[_COMMUNITY_File Rule API|File Rule API]]
- [[_COMMUNITY_Quick Message API|Quick Message API]]
- [[_COMMUNITY_Navigation Menu UI|Navigation Menu UI]]
- [[_COMMUNITY_Publication PDF Viewer|Publication PDF Viewer]]
- [[_COMMUNITY_File Rule Hooks|File Rule Hooks]]
- [[_COMMUNITY_Top Menu & User Hooks|Top Menu & User Hooks]]
- [[_COMMUNITY_Tabs UI Primitive|Tabs UI Primitive]]
- [[_COMMUNITY_Table UI Primitive|Table UI Primitive]]
- [[_COMMUNITY_Badge & Separator UI|Badge & Separator UI]]
- [[_COMMUNITY_Mail Folder Tree Component|Mail Folder Tree Component]]
- [[_COMMUNITY_Avatar UI Primitive|Avatar UI Primitive]]
- [[_COMMUNITY_Popover UI Primitive|Popover UI Primitive]]
- [[_COMMUNITY_Card UI Primitive|Card UI Primitive]]
- [[_COMMUNITY_Sheet UI Primitive|Sheet UI Primitive]]
- [[_COMMUNITY_Auth Hooks (LoginLogout)|Auth Hooks (Login/Logout)]]
- [[_COMMUNITY_DataTable UI Primitive|DataTable UI Primitive]]
- [[_COMMUNITY_Collapsible UI Primitive|Collapsible UI Primitive]]
- [[_COMMUNITY_Tooltip UI Primitive|Tooltip UI Primitive]]
- [[_COMMUNITY_Root Layout|Root Layout]]
- [[_COMMUNITY_Theme Provider|Theme Provider]]
- [[_COMMUNITY_Not Found Page|Not Found Page]]
- [[_COMMUNITY_Persuratan Page Route|Persuratan Page Route]]
- [[_COMMUNITY_Publikasi Page Route|Publikasi Page Route]]
- [[_COMMUNITY_Publikasi Template|Publikasi Template]]
- [[_COMMUNITY_Login Page Route|Login Page Route]]
- [[_COMMUNITY_Login Template|Login Template]]
- [[_COMMUNITY_Master Layout Template|Master Layout Template]]
- [[_COMMUNITY_Tipe Surat Page|Tipe Surat Page]]
- [[_COMMUNITY_Jenis Dokumen Page|Jenis Dokumen Page]]
- [[_COMMUNITY_File Rule Page|File Rule Page]]
- [[_COMMUNITY_Kategori Surat Page|Kategori Surat Page]]
- [[_COMMUNITY_Pesan Singkat Page|Pesan Singkat Page]]
- [[_COMMUNITY_useDebouncedValue Hook|useDebouncedValue Hook]]
- [[_COMMUNITY_useIsMobile Hook|useIsMobile Hook]]
- [[_COMMUNITY_Mail Navigation Hook|Mail Navigation Hook]]
- [[_COMMUNITY_Mail Folder Tree Hook|Mail Folder Tree Hook]]
- [[_COMMUNITY_Mail Toolbar Hook|Mail Toolbar Hook]]
- [[_COMMUNITY_Mail List State Hook|Mail List State Hook]]
- [[_COMMUNITY_Mail Detail State Hook|Mail Detail State Hook]]
- [[_COMMUNITY_Indonesian Date Helper|Indonesian Date Helper]]
- [[_COMMUNITY_cn() Utility|cn() Utility]]
- [[_COMMUNITY_Mail List Toggle|Mail List Toggle]]
- [[_COMMUNITY_Delete Confirm Dialog Builder|Delete Confirm Dialog Builder]]
- [[_COMMUNITY_Input File Control Builder|Input File Control Builder]]
- [[_COMMUNITY_Theme Toggle|Theme Toggle]]
- [[_COMMUNITY_Button UI Primitive|Button UI Primitive]]
- [[_COMMUNITY_Skeleton UI|Skeleton UI]]
- [[_COMMUNITY_Field UI Primitive|Field UI Primitive]]
- [[_COMMUNITY_Tooltip Button|Tooltip Button]]
- [[_COMMUNITY_Dropdown Menu UI|Dropdown Menu UI]]
- [[_COMMUNITY_label|label]]
- [[_COMMUNITY_dialog|dialog]]
- [[_COMMUNITY_smart-office-icon|smart-office-icon]]
- [[_COMMUNITY_input|input]]
- [[_COMMUNITY_logo|logo]]
- [[_COMMUNITY_switch|switch]]
- [[_COMMUNITY_audit-trail-info|audit-trail-info]]
- [[_COMMUNITY_textarea|textarea]]
- [[_COMMUNITY_footer|footer]]

## God Nodes (most connected - your core abstractions)
1. `resolveSession()` - 6 edges
2. `doLogin()` - 6 edges
3. `canEditMail()` - 6 edges
4. `proxy()` - 5 edges
5. `logout()` - 5 edges
6. `cn()` - 5 edges
7. `downloadPublication()` - 4 edges
8. `triggerDownload()` - 4 edges
9. `downloadAttachment()` - 4 edges
10. `isEmailValid()` - 4 edges

## Surprising Connections (you probably didn't know these)
- `doLogin()` --calls--> `isEmailValid()`  [INFERRED]
  actions/auth.ts → lib/email-validator.ts
- `doLogin()` --calls--> `createSession()`  [INFERRED]
  actions/auth.ts → lib/session.ts
- `logout()` --calls--> `getSession()`  [INFERRED]
  actions/auth.ts → lib/session.ts
- `logout()` --calls--> `getAppwriteSession()`  [INFERRED]
  actions/auth.ts → lib/session.ts
- `logout()` --calls--> `deleteSession()`  [INFERRED]
  actions/auth.ts → lib/session.ts

## Communities

### Community 0 - "Auth Actions & Email Validator"
Cohesion: 0.21
Nodes (14): createEmailSession(), createJwt(), doLogin(), getUserProfile(), logout(), isEmailValid(), validateEmail(), createSession() (+6 more)

### Community 1 - "Publication API"
Cohesion: 0.24
Nodes (11): createPublication(), deletePublication(), downloadPublication(), fetchDocumentTypesLookup(), fetchPublication(), fetchPublications(), getPublicationDownloadUrl(), publishPublication() (+3 more)

### Community 2 - "Mail API (Drafts/Threads)"
Cohesion: 0.27
Nodes (13): createDraft(), deleteMail(), fetchMailsInFolder(), fetchReadStatus(), fetchThread(), fetchTracking(), mapPagedResponse(), markRead() (+5 more)

### Community 3 - "Publication Hooks & Form"
Cohesion: 0.26
Nodes (8): formatDate(), formatFileSize(), getFileType(), statusBadge(), useDocumentTypeOptions(), usePublication(), usePublications(), CreatePublicationDialog()

### Community 4 - "Mail Category Hooks & Form"
Cohesion: 0.29
Nodes (7): useCreateMailCategory(), useDeleteMailCategory(), useMailCategories(), useMailCategory(), useMailTypeOptions(), useUpdateMailCategory(), CreateMailCategoryDialog()

### Community 5 - "Mail Folder API"
Cohesion: 0.33
Nodes (9): createFolder(), deleteFolder(), deleteMailFromFolder(), emptyTrash(), fetchFolderCounters(), fetchFolderTree(), moveMails(), renameFolder() (+1 more)

### Community 6 - "RBAC Permissions"
Cohesion: 0.42
Nodes (9): canDeleteMail(), canEditMail(), canManageAttachment(), canManageFolder(), canSendMail(), getAllPermissions(), getJabatan(), hasPermission() (+1 more)

### Community 7 - "Sidebar UI"
Cohesion: 0.4
Nodes (9): cn(), handleKeyDown(), SidebarGroupContent(), SidebarMenu(), SidebarMenuAction(), SidebarMenuButton(), SidebarMenuItem(), SidebarMenuSubButton() (+1 more)

### Community 8 - "Auth Proxy & JWT Refresh"
Cohesion: 0.49
Nodes (8): cleanupDecryptCache(), decryptAppwriteSession(), getTokenExp(), isProtectedPath(), proxy(), refreshJwt(), resolveSession(), setCookieOnResponse()

### Community 9 - "Select UI Primitive"
Cohesion: 0.36
Nodes (8): SelectContent(), SelectGroup(), SelectItem(), SelectLabel(), SelectScrollDownButton(), SelectSeparator(), SelectTrigger(), SelectValue()

### Community 10 - "Mail Recipient API"
Cohesion: 0.36
Nodes (8): addRecipient(), addRecipientsBatch(), copyFrom(), copyThread(), deleteRecipient(), deleteRecipientsBatch(), fetchRecipients(), updateNotifFlags()

### Community 11 - "Mail Type API"
Cohesion: 0.39
Nodes (7): createMailType(), deleteMailType(), fetchMailType(), fetchMailTypes(), fetchMailTypesLookup(), toggleMailTypeStatus(), updateMailType()

### Community 12 - "Document Type API"
Cohesion: 0.39
Nodes (7): createDocumentType(), deleteDocumentType(), fetchDocumentType(), fetchDocumentTypes(), fetchDocumentTypesLookup(), toggleDocumentTypeStatus(), updateDocumentType()

### Community 13 - "Menubar UI Primitive"
Cohesion: 0.39
Nodes (7): cn(), Menubar(), MenubarGroup(), MenubarMenu(), MenubarPortal(), MenubarRadioGroup(), MenubarRadioItem()

### Community 14 - "Document Type Hooks & Form"
Cohesion: 0.32
Nodes (4): CreateDocumentTypeDialog(), useCreateDocumentType(), useDocumentTypes(), useUpdateDocumentType()

### Community 15 - "Mail Type Hooks & Form"
Cohesion: 0.32
Nodes (4): useCreateMailType(), useMailTypes(), useUpdateMailType(), CreateMailTypeDialog()

### Community 16 - "Quick Message Hooks & Form"
Cohesion: 0.32
Nodes (4): useCreateQuickMessage(), useQuickMessages(), useUpdateQuickMessage(), CreateQuickMessageDialog()

### Community 17 - "Mail Category API"
Cohesion: 0.43
Nodes (6): createMailCategory(), deleteMailCategory(), fetchMailCategories(), fetchMailCategory(), toggleMailCategoryStatus(), updateMailCategory()

### Community 18 - "Mail Attachment API"
Cohesion: 0.5
Nodes (6): deleteAttachment(), downloadAttachment(), fetchAttachments(), getAttachmentDownloadUrl(), triggerAttachmentDownload(), uploadAttachment()

### Community 19 - "Pagination & Query State Hooks"
Cohesion: 0.33
Nodes (3): usePagination(), useQueryState(), useQueryStates()

### Community 20 - "File Rule API"
Cohesion: 0.48
Nodes (5): createFileRule(), deleteFileRule(), fetchFileRules(), fetchFileRulesLookup(), updateFileRule()

### Community 21 - "Quick Message API"
Cohesion: 0.48
Nodes (5): createQuickMessage(), deleteQuickMessage(), fetchQuickMessage(), fetchQuickMessages(), updateQuickMessage()

### Community 22 - "Navigation Menu UI"
Cohesion: 0.48
Nodes (5): NavigationMenu(), NavigationMenuContent(), NavigationMenuLink(), NavigationMenuList(), NavigationMenuTrigger()

### Community 23 - "Publication PDF Viewer"
Cohesion: 0.48
Nodes (5): changePage(), handleRotate(), handleZoomIn(), handleZoomOut(), onDocumentLoadSuccess()

### Community 24 - "File Rule Hooks"
Cohesion: 0.53
Nodes (4): useCreateFileRule(), useDeleteFileRule(), useFileRules(), useUpdateFileRule()

### Community 25 - "Top Menu & User Hooks"
Cohesion: 0.33
Nodes (2): useTopMenu(), useUser()

### Community 26 - "Tabs UI Primitive"
Cohesion: 0.53
Nodes (4): Tabs(), TabsContent(), TabsList(), TabsTrigger()

### Community 27 - "Table UI Primitive"
Cohesion: 0.53
Nodes (4): cn(), Table(), TableBody(), TableHeader()

### Community 28 - "Badge & Separator UI"
Cohesion: 0.33
Nodes (2): Badge(), cn()

### Community 29 - "Mail Folder Tree Component"
Cohesion: 0.6
Nodes (3): cn(), getIcon(), handleSelectFolder()

### Community 30 - "Avatar UI Primitive"
Cohesion: 0.6
Nodes (3): Avatar(), AvatarFallback(), AvatarImage()

### Community 31 - "Popover UI Primitive"
Cohesion: 0.6
Nodes (3): cn(), PopoverDescription(), PopoverTitle()

### Community 32 - "Card UI Primitive"
Cohesion: 0.6
Nodes (3): CardAction(), CardDescription(), cn()

### Community 33 - "Sheet UI Primitive"
Cohesion: 0.6
Nodes (3): cn(), SheetDescription(), SheetTitle()

### Community 34 - "Auth Hooks (Login/Logout)"
Cohesion: 0.67
Nodes (2): useLogin(), useLogout()

### Community 35 - "DataTable UI Primitive"
Cohesion: 0.67
Nodes (2): handleClearSearch(), handleSearchInput()

### Community 36 - "Collapsible UI Primitive"
Cohesion: 0.67
Nodes (2): CollapsibleContent(), CollapsibleTrigger()

### Community 37 - "Tooltip UI Primitive"
Cohesion: 0.67
Nodes (2): TooltipContent(), TooltipProvider()

### Community 38 - "Root Layout"
Cohesion: 0.67
Nodes (1): RootLayout()

### Community 39 - "Theme Provider"
Cohesion: 0.67
Nodes (1): CustomThemeProvider()

### Community 40 - "Not Found Page"
Cohesion: 0.67
Nodes (1): NotFound()

### Community 41 - "Persuratan Page Route"
Cohesion: 0.67
Nodes (1): PersuratanPage()

### Community 42 - "Publikasi Page Route"
Cohesion: 0.67
Nodes (1): PublikasiPage()

### Community 43 - "Publikasi Template"
Cohesion: 0.67
Nodes (1): Template()

### Community 44 - "Login Page Route"
Cohesion: 0.67
Nodes (1): Page()

### Community 45 - "Login Template"
Cohesion: 0.67
Nodes (1): Template()

### Community 46 - "Master Layout Template"
Cohesion: 0.67
Nodes (1): MasterLayout()

### Community 47 - "Tipe Surat Page"
Cohesion: 0.67
Nodes (1): TipeSuratPage()

### Community 48 - "Jenis Dokumen Page"
Cohesion: 0.67
Nodes (1): JenisDokumenPage()

### Community 49 - "File Rule Page"
Cohesion: 0.67
Nodes (1): FileRulePage()

### Community 50 - "Kategori Surat Page"
Cohesion: 0.67
Nodes (1): KategoriSuratPage()

### Community 51 - "Pesan Singkat Page"
Cohesion: 0.67
Nodes (1): PesanSingkatPage()

### Community 52 - "useDebouncedValue Hook"
Cohesion: 0.67
Nodes (1): useDebouncedValue()

### Community 53 - "useIsMobile Hook"
Cohesion: 0.67
Nodes (1): useIsMobile()

### Community 54 - "Mail Navigation Hook"
Cohesion: 0.67
Nodes (1): useMailNavigation()

### Community 55 - "Mail Folder Tree Hook"
Cohesion: 0.67
Nodes (1): useMailFolderTree()

### Community 56 - "Mail Toolbar Hook"
Cohesion: 0.67
Nodes (1): useMailToolbar()

### Community 57 - "Mail List State Hook"
Cohesion: 0.67
Nodes (1): useMailListState()

### Community 58 - "Mail Detail State Hook"
Cohesion: 0.67
Nodes (1): useMailDetailState()

### Community 59 - "Indonesian Date Helper"
Cohesion: 0.67
Nodes (1): formatIndonesianDate()

### Community 60 - "cn() Utility"
Cohesion: 0.67
Nodes (1): cn()

### Community 61 - "Mail List Toggle"
Cohesion: 0.67
Nodes (1): MailListToggle()

### Community 62 - "Delete Confirm Dialog Builder"
Cohesion: 0.67
Nodes (1): DeleteConfirmDialog()

### Community 63 - "Input File Control Builder"
Cohesion: 0.67
Nodes (1): InputFileControll()

### Community 64 - "Theme Toggle"
Cohesion: 0.67
Nodes (1): toggleTheme()

### Community 65 - "Button UI Primitive"
Cohesion: 0.67
Nodes (1): cn()

### Community 66 - "Skeleton UI"
Cohesion: 0.67
Nodes (1): Skeleton()

### Community 67 - "Field UI Primitive"
Cohesion: 0.67
Nodes (1): cn()

### Community 68 - "Tooltip Button"
Cohesion: 0.67
Nodes (1): TooltipButton()

### Community 69 - "Dropdown Menu UI"
Cohesion: 0.67
Nodes (1): DropdownMenuPortal()

### Community 70 - "label"
Cohesion: 0.67
Nodes (1): cn()

### Community 71 - "dialog"
Cohesion: 0.67
Nodes (1): cn()

### Community 72 - "smart-office-icon"
Cohesion: 0.67
Nodes (1): SmartOfficeIcon()

### Community 73 - "input"
Cohesion: 0.67
Nodes (1): Input()

### Community 74 - "logo"
Cohesion: 0.67
Nodes (1): Logo()

### Community 75 - "switch"
Cohesion: 0.67
Nodes (1): Switch()

### Community 76 - "audit-trail-info"
Cohesion: 0.67
Nodes (1): AuditTrailInfo()

### Community 77 - "textarea"
Cohesion: 0.67
Nodes (1): cn()

### Community 78 - "footer"
Cohesion: 0.67
Nodes (1): Footer()

## Knowledge Gaps
- **Thin community `Top Menu & User Hooks`** (6 nodes): `use-top-menu.ts`, `useTopMenu()`, `use-user.ts`, `useUser()`, `use-top-menu.ts`, `use-user.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Badge & Separator UI`** (6 nodes): `badge.tsx`, `separator.tsx`, `badge.tsx`, `separator.tsx`, `Badge()`, `cn()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Auth Hooks (Login/Logout)`** (4 nodes): `auth-hooks.tsx`, `useLogin()`, `useLogout()`, `auth-hooks.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `DataTable UI Primitive`** (4 nodes): `data-table.tsx`, `data-table.tsx`, `handleClearSearch()`, `handleSearchInput()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Collapsible UI Primitive`** (4 nodes): `collapsible.tsx`, `collapsible.tsx`, `CollapsibleContent()`, `CollapsibleTrigger()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Tooltip UI Primitive`** (4 nodes): `tooltip.tsx`, `tooltip.tsx`, `TooltipContent()`, `TooltipProvider()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Root Layout`** (3 nodes): `RootLayout()`, `layout.tsx`, `layout.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Theme Provider`** (3 nodes): `CustomThemeProvider()`, `theme-providers.tsx`, `theme-providers.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Not Found Page`** (3 nodes): `NotFound()`, `not-found.tsx`, `not-found.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Persuratan Page Route`** (3 nodes): `page.tsx`, `page.tsx`, `PersuratanPage()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Publikasi Page Route`** (3 nodes): `page.tsx`, `page.tsx`, `PublikasiPage()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Publikasi Template`** (3 nodes): `template.tsx`, `template.tsx`, `Template()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Login Page Route`** (3 nodes): `page.tsx`, `Page()`, `page.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Login Template`** (3 nodes): `template.tsx`, `Template()`, `template.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Master Layout Template`** (3 nodes): `template.tsx`, `MasterLayout()`, `template.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Tipe Surat Page`** (3 nodes): `page.tsx`, `page.tsx`, `TipeSuratPage()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Jenis Dokumen Page`** (3 nodes): `page.tsx`, `JenisDokumenPage()`, `page.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `File Rule Page`** (3 nodes): `page.tsx`, `FileRulePage()`, `page.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Kategori Surat Page`** (3 nodes): `page.tsx`, `KategoriSuratPage()`, `page.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Pesan Singkat Page`** (3 nodes): `page.tsx`, `page.tsx`, `PesanSingkatPage()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `useDebouncedValue Hook`** (3 nodes): `use-debounced-value.ts`, `useDebouncedValue()`, `use-debounced-value.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `useIsMobile Hook`** (3 nodes): `use-mobile.ts`, `useIsMobile()`, `use-mobile.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Mail Navigation Hook`** (3 nodes): `use-mail-navigation.ts`, `use-mail-navigation.ts`, `useMailNavigation()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Mail Folder Tree Hook`** (3 nodes): `use-mail-folder-tree.ts`, `use-mail-folder-tree.ts`, `useMailFolderTree()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Mail Toolbar Hook`** (3 nodes): `use-mail-toolbar.ts`, `use-mail-toolbar.ts`, `useMailToolbar()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Mail List State Hook`** (3 nodes): `use-mail-list-state.ts`, `use-mail-list-state.ts`, `useMailListState()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Mail Detail State Hook`** (3 nodes): `use-mail-detail-state.ts`, `use-mail-detail-state.ts`, `useMailDetailState()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Indonesian Date Helper`** (3 nodes): `formatIndonesianDate()`, `date-helper.ts`, `date-helper.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `cn() Utility`** (3 nodes): `cn()`, `utils.ts`, `utils.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Mail List Toggle`** (3 nodes): `mail-list-toggle.tsx`, `mail-list-toggle.tsx`, `MailListToggle()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Delete Confirm Dialog Builder`** (3 nodes): `DeleteConfirmDialog()`, `delete-confirm-dialog.tsx`, `delete-confirm-dialog.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Input File Control Builder`** (3 nodes): `InputFileControll()`, `input-file-controll.tsx`, `input-file-controll.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Theme Toggle`** (3 nodes): `theme-toggle.tsx`, `theme-toggle.tsx`, `toggleTheme()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Button UI Primitive`** (3 nodes): `button.tsx`, `button.tsx`, `cn()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Skeleton UI`** (3 nodes): `skeleton.tsx`, `skeleton.tsx`, `Skeleton()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Field UI Primitive`** (3 nodes): `field.tsx`, `field.tsx`, `cn()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Tooltip Button`** (3 nodes): `tooltip-button.tsx`, `tooltip-button.tsx`, `TooltipButton()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Dropdown Menu UI`** (3 nodes): `dropdown-menu.tsx`, `dropdown-menu.tsx`, `DropdownMenuPortal()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `label`** (3 nodes): `label.tsx`, `label.tsx`, `cn()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `dialog`** (3 nodes): `dialog.tsx`, `dialog.tsx`, `cn()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `smart-office-icon`** (3 nodes): `smart-office-icon.tsx`, `smart-office-icon.tsx`, `SmartOfficeIcon()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `input`** (3 nodes): `input.tsx`, `input.tsx`, `Input()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `logo`** (3 nodes): `logo.tsx`, `logo.tsx`, `Logo()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `switch`** (3 nodes): `switch.tsx`, `switch.tsx`, `Switch()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `audit-trail-info`** (3 nodes): `audit-trail-info.tsx`, `audit-trail-info.tsx`, `AuditTrailInfo()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `textarea`** (3 nodes): `textarea.tsx`, `textarea.tsx`, `cn()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `footer`** (3 nodes): `footer.tsx`, `Footer()`, `footer.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Are the 2 inferred relationships involving `doLogin()` (e.g. with `isEmailValid()` and `createSession()`) actually correct?**
  _`doLogin()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **Are the 3 inferred relationships involving `logout()` (e.g. with `getSession()` and `getAppwriteSession()`) actually correct?**
  _`logout()` has 3 INFERRED edges - model-reasoned connections that need verification._
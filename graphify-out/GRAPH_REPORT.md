# Graph Report - /mnt/DATA/html/mail-fe  (2026-04-28)

## Corpus Check
- Corpus is ~36,963 words - fits in a single context window. You may not need a graph.

## Summary
- 550 nodes · 547 edges · 79 communities detected
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 15 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Persuratan Mail System|Persuratan Mail System]]
- [[_COMMUNITY_UI Components|UI Components]]
- [[_COMMUNITY_API and Data Handling|API and Data Handling]]
- [[_COMMUNITY_Authentication|Authentication]]
- [[_COMMUNITY_Master Data Management|Master Data Management]]
- [[_COMMUNITY_Dashboard and Navigation|Dashboard and Navigation]]
- [[_COMMUNITY_File Handling|File Handling]]
- [[_COMMUNITY_Publication Management|Publication Management]]
- [[_COMMUNITY_Utility Hooks|Utility Hooks]]
- [[_COMMUNITY_Builder Components|Builder Components]]
- [[_COMMUNITY_Mail Type Management|Mail Type Management]]
- [[_COMMUNITY_Document Type Management|Document Type Management]]
- [[_COMMUNITY_Mail Category Management|Mail Category Management]]
- [[_COMMUNITY_Quick Message Management|Quick Message Management]]
- [[_COMMUNITY_File Rule Management|File Rule Management]]
- [[_COMMUNITY_Mail Folder and Recipient|Mail Folder and Recipient]]
- [[_COMMUNITY_Publication Handling|Publication Handling]]
- [[_COMMUNITY_Login and Session Management|Login and Session Management]]
- [[_COMMUNITY_General UI Elements|General UI Elements]]
- [[_COMMUNITY_Error Handling and Layouts|Error Handling and Layouts]]
- [[_COMMUNITY_Configuration and Proxy|Configuration and Proxy]]
- [[_COMMUNITY_Mail Detail and List Views|Mail Detail and List Views]]
- [[_COMMUNITY_Form Controls|Form Controls]]
- [[_COMMUNITY_Navigation and Menus|Navigation and Menus]]
- [[_COMMUNITY_Data Structures|Data Structures]]
- [[_COMMUNITY_API Client Utilities|API Client Utilities]]
- [[_COMMUNITY_Routing and Templates|Routing and Templates]]
- [[_COMMUNITY_Shared UI Components|Shared UI Components]]
- [[_COMMUNITY_Test and Scripting|Test and Scripting]]
- [[_COMMUNITY_Public Assets|Public Assets]]
- [[_COMMUNITY_Build and Config Files|Build and Config Files]]
- [[_COMMUNITY_Plan and Docs|Plan and Docs]]
- [[_COMMUNITY_Infrastructure|Infrastructure]]
- [[_COMMUNITY_Helper Modules|Helper Modules]]
- [[_COMMUNITY_Project Structure|Project Structure]]
- [[_COMMUNITY_Core Logic|Core Logic]]
- [[_COMMUNITY_UI Elements|UI Elements]]
- [[_COMMUNITY_Data Models|Data Models]]
- [[_COMMUNITY_Abstract Components|Abstract Components]]
- [[_COMMUNITY_User Interface|User Interface]]
- [[_COMMUNITY_Core Functionality|Core Functionality]]
- [[_COMMUNITY_Configuration|Configuration]]
- [[_COMMUNITY_Helpers|Helpers]]
- [[_COMMUNITY_Application Logic|Application Logic]]
- [[_COMMUNITY_Abstract Modules|Abstract Modules]]
- [[_COMMUNITY_System Components|System Components]]
- [[_COMMUNITY_Data Management|Data Management]]
- [[_COMMUNITY_User Interface Components|User Interface Components]]
- [[_COMMUNITY_API Clients|API Clients]]
- [[_COMMUNITY_Core Utilities|Core Utilities]]
- [[_COMMUNITY_Abstract Logic|Abstract Logic]]
- [[_COMMUNITY_Application Structure|Application Structure]]
- [[_COMMUNITY_UI Patterns|UI Patterns]]
- [[_COMMUNITY_Data Abstraction|Data Abstraction]]
- [[_COMMUNITY_Core Modules|Core Modules]]
- [[_COMMUNITY_System Logic|System Logic]]
- [[_COMMUNITY_Functional Components|Functional Components]]
- [[_COMMUNITY_Business Logic|Business Logic]]
- [[_COMMUNITY_Data Layer|Data Layer]]
- [[_COMMUNITY_Presentation Layer|Presentation Layer]]
- [[_COMMUNITY_Controller Logic|Controller Logic]]
- [[_COMMUNITY_Service Layer|Service Layer]]
- [[_COMMUNITY_Model Layer|Model Layer]]
- [[_COMMUNITY_View Layer|View Layer]]
- [[_COMMUNITY_Resource Management|Resource Management]]
- [[_COMMUNITY_Asset Handling|Asset Handling]]
- [[_COMMUNITY_Configuration Management|Configuration Management]]
- [[_COMMUNITY_User Interface Logic|User Interface Logic]]
- [[_COMMUNITY_Application Architecture|Application Architecture]]
- [[_COMMUNITY_Backend Integration|Backend Integration]]
- [[_COMMUNITY_Frontend Development|Frontend Development]]
- [[_COMMUNITY_Software Engineering|Software Engineering]]
- [[_COMMUNITY_Project Management|Project Management]]
- [[_COMMUNITY_Documentation|Documentation]]
- [[_COMMUNITY_Testing|Testing]]
- [[_COMMUNITY_Deployment|Deployment]]
- [[_COMMUNITY_Community 76|Community 76]]
- [[_COMMUNITY_Community 77|Community 77]]
- [[_COMMUNITY_Community 78|Community 78]]

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

### Community 0 - "Persuratan Mail System"
Cohesion: 0.21
Nodes (14): createEmailSession(), createJwt(), doLogin(), getUserProfile(), logout(), isEmailValid(), validateEmail(), createSession() (+6 more)

### Community 1 - "UI Components"
Cohesion: 0.24
Nodes (11): createPublication(), deletePublication(), downloadPublication(), fetchDocumentTypesLookup(), fetchPublication(), fetchPublications(), getPublicationDownloadUrl(), publishPublication() (+3 more)

### Community 2 - "API and Data Handling"
Cohesion: 0.27
Nodes (13): createDraft(), deleteMail(), fetchMailsInFolder(), fetchReadStatus(), fetchThread(), fetchTracking(), mapPagedResponse(), markRead() (+5 more)

### Community 3 - "Authentication"
Cohesion: 0.26
Nodes (8): formatDate(), formatFileSize(), getFileType(), statusBadge(), useDocumentTypeOptions(), usePublication(), usePublications(), CreatePublicationDialog()

### Community 4 - "Master Data Management"
Cohesion: 0.29
Nodes (7): useCreateMailCategory(), useDeleteMailCategory(), useMailCategories(), useMailCategory(), useMailTypeOptions(), useUpdateMailCategory(), CreateMailCategoryDialog()

### Community 5 - "Dashboard and Navigation"
Cohesion: 0.33
Nodes (9): createFolder(), deleteFolder(), deleteMailFromFolder(), emptyTrash(), fetchFolderCounters(), fetchFolderTree(), moveMails(), renameFolder() (+1 more)

### Community 6 - "File Handling"
Cohesion: 0.42
Nodes (9): canDeleteMail(), canEditMail(), canManageAttachment(), canManageFolder(), canSendMail(), getAllPermissions(), getJabatan(), hasPermission() (+1 more)

### Community 7 - "Publication Management"
Cohesion: 0.4
Nodes (9): cn(), handleKeyDown(), SidebarGroupContent(), SidebarMenu(), SidebarMenuAction(), SidebarMenuButton(), SidebarMenuItem(), SidebarMenuSubButton() (+1 more)

### Community 8 - "Utility Hooks"
Cohesion: 0.49
Nodes (8): cleanupDecryptCache(), decryptAppwriteSession(), getTokenExp(), isProtectedPath(), proxy(), refreshJwt(), resolveSession(), setCookieOnResponse()

### Community 9 - "Builder Components"
Cohesion: 0.36
Nodes (8): SelectContent(), SelectGroup(), SelectItem(), SelectLabel(), SelectScrollDownButton(), SelectSeparator(), SelectTrigger(), SelectValue()

### Community 10 - "Mail Type Management"
Cohesion: 0.36
Nodes (8): addRecipient(), addRecipientsBatch(), copyFrom(), copyThread(), deleteRecipient(), deleteRecipientsBatch(), fetchRecipients(), updateNotifFlags()

### Community 11 - "Document Type Management"
Cohesion: 0.39
Nodes (7): createMailType(), deleteMailType(), fetchMailType(), fetchMailTypes(), fetchMailTypesLookup(), toggleMailTypeStatus(), updateMailType()

### Community 12 - "Mail Category Management"
Cohesion: 0.39
Nodes (7): createDocumentType(), deleteDocumentType(), fetchDocumentType(), fetchDocumentTypes(), fetchDocumentTypesLookup(), toggleDocumentTypeStatus(), updateDocumentType()

### Community 13 - "Quick Message Management"
Cohesion: 0.39
Nodes (7): cn(), Menubar(), MenubarGroup(), MenubarMenu(), MenubarPortal(), MenubarRadioGroup(), MenubarRadioItem()

### Community 14 - "File Rule Management"
Cohesion: 0.32
Nodes (4): CreateDocumentTypeDialog(), useCreateDocumentType(), useDocumentTypes(), useUpdateDocumentType()

### Community 15 - "Mail Folder and Recipient"
Cohesion: 0.32
Nodes (4): useCreateMailType(), useMailTypes(), useUpdateMailType(), CreateMailTypeDialog()

### Community 16 - "Publication Handling"
Cohesion: 0.32
Nodes (4): useCreateQuickMessage(), useQuickMessages(), useUpdateQuickMessage(), CreateQuickMessageDialog()

### Community 17 - "Login and Session Management"
Cohesion: 0.43
Nodes (6): createMailCategory(), deleteMailCategory(), fetchMailCategories(), fetchMailCategory(), toggleMailCategoryStatus(), updateMailCategory()

### Community 18 - "General UI Elements"
Cohesion: 0.5
Nodes (6): deleteAttachment(), downloadAttachment(), fetchAttachments(), getAttachmentDownloadUrl(), triggerAttachmentDownload(), uploadAttachment()

### Community 19 - "Error Handling and Layouts"
Cohesion: 0.33
Nodes (3): usePagination(), useQueryState(), useQueryStates()

### Community 20 - "Configuration and Proxy"
Cohesion: 0.48
Nodes (5): createFileRule(), deleteFileRule(), fetchFileRules(), fetchFileRulesLookup(), updateFileRule()

### Community 21 - "Mail Detail and List Views"
Cohesion: 0.48
Nodes (5): createQuickMessage(), deleteQuickMessage(), fetchQuickMessage(), fetchQuickMessages(), updateQuickMessage()

### Community 22 - "Form Controls"
Cohesion: 0.48
Nodes (5): NavigationMenu(), NavigationMenuContent(), NavigationMenuLink(), NavigationMenuList(), NavigationMenuTrigger()

### Community 23 - "Navigation and Menus"
Cohesion: 0.48
Nodes (5): changePage(), handleRotate(), handleZoomIn(), handleZoomOut(), onDocumentLoadSuccess()

### Community 24 - "Data Structures"
Cohesion: 0.53
Nodes (4): useCreateFileRule(), useDeleteFileRule(), useFileRules(), useUpdateFileRule()

### Community 25 - "API Client Utilities"
Cohesion: 0.33
Nodes (2): useTopMenu(), useUser()

### Community 26 - "Routing and Templates"
Cohesion: 0.53
Nodes (4): Tabs(), TabsContent(), TabsList(), TabsTrigger()

### Community 27 - "Shared UI Components"
Cohesion: 0.53
Nodes (4): cn(), Table(), TableBody(), TableHeader()

### Community 28 - "Test and Scripting"
Cohesion: 0.33
Nodes (2): Badge(), cn()

### Community 29 - "Public Assets"
Cohesion: 0.6
Nodes (3): cn(), getIcon(), handleSelectFolder()

### Community 30 - "Build and Config Files"
Cohesion: 0.6
Nodes (3): Avatar(), AvatarFallback(), AvatarImage()

### Community 31 - "Plan and Docs"
Cohesion: 0.6
Nodes (3): cn(), PopoverDescription(), PopoverTitle()

### Community 32 - "Infrastructure"
Cohesion: 0.6
Nodes (3): CardAction(), CardDescription(), cn()

### Community 33 - "Helper Modules"
Cohesion: 0.6
Nodes (3): cn(), SheetDescription(), SheetTitle()

### Community 34 - "Project Structure"
Cohesion: 0.67
Nodes (2): useLogin(), useLogout()

### Community 35 - "Core Logic"
Cohesion: 0.67
Nodes (2): handleClearSearch(), handleSearchInput()

### Community 36 - "UI Elements"
Cohesion: 0.67
Nodes (2): CollapsibleContent(), CollapsibleTrigger()

### Community 37 - "Data Models"
Cohesion: 0.67
Nodes (2): TooltipContent(), TooltipProvider()

### Community 38 - "Abstract Components"
Cohesion: 0.67
Nodes (1): RootLayout()

### Community 39 - "User Interface"
Cohesion: 0.67
Nodes (1): CustomThemeProvider()

### Community 40 - "Core Functionality"
Cohesion: 0.67
Nodes (1): NotFound()

### Community 41 - "Configuration"
Cohesion: 0.67
Nodes (1): PersuratanPage()

### Community 42 - "Helpers"
Cohesion: 0.67
Nodes (1): PublikasiPage()

### Community 43 - "Application Logic"
Cohesion: 0.67
Nodes (1): Template()

### Community 44 - "Abstract Modules"
Cohesion: 0.67
Nodes (1): Page()

### Community 45 - "System Components"
Cohesion: 0.67
Nodes (1): Template()

### Community 46 - "Data Management"
Cohesion: 0.67
Nodes (1): MasterLayout()

### Community 47 - "User Interface Components"
Cohesion: 0.67
Nodes (1): TipeSuratPage()

### Community 48 - "API Clients"
Cohesion: 0.67
Nodes (1): JenisDokumenPage()

### Community 49 - "Core Utilities"
Cohesion: 0.67
Nodes (1): FileRulePage()

### Community 50 - "Abstract Logic"
Cohesion: 0.67
Nodes (1): KategoriSuratPage()

### Community 51 - "Application Structure"
Cohesion: 0.67
Nodes (1): PesanSingkatPage()

### Community 52 - "UI Patterns"
Cohesion: 0.67
Nodes (1): useDebouncedValue()

### Community 53 - "Data Abstraction"
Cohesion: 0.67
Nodes (1): useIsMobile()

### Community 54 - "Core Modules"
Cohesion: 0.67
Nodes (1): useMailNavigation()

### Community 55 - "System Logic"
Cohesion: 0.67
Nodes (1): useMailFolderTree()

### Community 56 - "Functional Components"
Cohesion: 0.67
Nodes (1): useMailToolbar()

### Community 57 - "Business Logic"
Cohesion: 0.67
Nodes (1): useMailListState()

### Community 58 - "Data Layer"
Cohesion: 0.67
Nodes (1): useMailDetailState()

### Community 59 - "Presentation Layer"
Cohesion: 0.67
Nodes (1): formatIndonesianDate()

### Community 60 - "Controller Logic"
Cohesion: 0.67
Nodes (1): cn()

### Community 61 - "Service Layer"
Cohesion: 0.67
Nodes (1): MailListToggle()

### Community 62 - "Model Layer"
Cohesion: 0.67
Nodes (1): DeleteConfirmDialog()

### Community 63 - "View Layer"
Cohesion: 0.67
Nodes (1): InputFileControll()

### Community 64 - "Resource Management"
Cohesion: 0.67
Nodes (1): toggleTheme()

### Community 65 - "Asset Handling"
Cohesion: 0.67
Nodes (1): cn()

### Community 66 - "Configuration Management"
Cohesion: 0.67
Nodes (1): Skeleton()

### Community 67 - "User Interface Logic"
Cohesion: 0.67
Nodes (1): cn()

### Community 68 - "Application Architecture"
Cohesion: 0.67
Nodes (1): TooltipButton()

### Community 69 - "Backend Integration"
Cohesion: 0.67
Nodes (1): DropdownMenuPortal()

### Community 70 - "Frontend Development"
Cohesion: 0.67
Nodes (1): cn()

### Community 71 - "Software Engineering"
Cohesion: 0.67
Nodes (1): cn()

### Community 72 - "Project Management"
Cohesion: 0.67
Nodes (1): SmartOfficeIcon()

### Community 73 - "Documentation"
Cohesion: 0.67
Nodes (1): Input()

### Community 74 - "Testing"
Cohesion: 0.67
Nodes (1): Logo()

### Community 75 - "Deployment"
Cohesion: 0.67
Nodes (1): Switch()

### Community 76 - "Community 76"
Cohesion: 0.67
Nodes (1): AuditTrailInfo()

### Community 77 - "Community 77"
Cohesion: 0.67
Nodes (1): cn()

### Community 78 - "Community 78"
Cohesion: 0.67
Nodes (1): Footer()

## Knowledge Gaps
- **Thin community `API Client Utilities`** (6 nodes): `use-top-menu.ts`, `useTopMenu()`, `use-user.ts`, `useUser()`, `use-top-menu.ts`, `use-user.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Test and Scripting`** (6 nodes): `badge.tsx`, `separator.tsx`, `badge.tsx`, `separator.tsx`, `Badge()`, `cn()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Project Structure`** (4 nodes): `auth-hooks.tsx`, `useLogin()`, `useLogout()`, `auth-hooks.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Core Logic`** (4 nodes): `data-table.tsx`, `data-table.tsx`, `handleClearSearch()`, `handleSearchInput()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `UI Elements`** (4 nodes): `collapsible.tsx`, `collapsible.tsx`, `CollapsibleContent()`, `CollapsibleTrigger()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Data Models`** (4 nodes): `tooltip.tsx`, `tooltip.tsx`, `TooltipContent()`, `TooltipProvider()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Abstract Components`** (3 nodes): `RootLayout()`, `layout.tsx`, `layout.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `User Interface`** (3 nodes): `CustomThemeProvider()`, `theme-providers.tsx`, `theme-providers.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Core Functionality`** (3 nodes): `NotFound()`, `not-found.tsx`, `not-found.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Configuration`** (3 nodes): `page.tsx`, `page.tsx`, `PersuratanPage()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Helpers`** (3 nodes): `page.tsx`, `page.tsx`, `PublikasiPage()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Application Logic`** (3 nodes): `template.tsx`, `template.tsx`, `Template()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Abstract Modules`** (3 nodes): `page.tsx`, `Page()`, `page.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `System Components`** (3 nodes): `template.tsx`, `Template()`, `template.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Data Management`** (3 nodes): `template.tsx`, `MasterLayout()`, `template.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `User Interface Components`** (3 nodes): `page.tsx`, `page.tsx`, `TipeSuratPage()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `API Clients`** (3 nodes): `page.tsx`, `JenisDokumenPage()`, `page.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Core Utilities`** (3 nodes): `page.tsx`, `FileRulePage()`, `page.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Abstract Logic`** (3 nodes): `page.tsx`, `KategoriSuratPage()`, `page.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Application Structure`** (3 nodes): `page.tsx`, `page.tsx`, `PesanSingkatPage()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `UI Patterns`** (3 nodes): `use-debounced-value.ts`, `useDebouncedValue()`, `use-debounced-value.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Data Abstraction`** (3 nodes): `use-mobile.ts`, `useIsMobile()`, `use-mobile.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Core Modules`** (3 nodes): `use-mail-navigation.ts`, `use-mail-navigation.ts`, `useMailNavigation()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `System Logic`** (3 nodes): `use-mail-folder-tree.ts`, `use-mail-folder-tree.ts`, `useMailFolderTree()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Functional Components`** (3 nodes): `use-mail-toolbar.ts`, `use-mail-toolbar.ts`, `useMailToolbar()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Business Logic`** (3 nodes): `use-mail-list-state.ts`, `use-mail-list-state.ts`, `useMailListState()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Data Layer`** (3 nodes): `use-mail-detail-state.ts`, `use-mail-detail-state.ts`, `useMailDetailState()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Presentation Layer`** (3 nodes): `formatIndonesianDate()`, `date-helper.ts`, `date-helper.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Controller Logic`** (3 nodes): `cn()`, `utils.ts`, `utils.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Service Layer`** (3 nodes): `mail-list-toggle.tsx`, `mail-list-toggle.tsx`, `MailListToggle()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Model Layer`** (3 nodes): `DeleteConfirmDialog()`, `delete-confirm-dialog.tsx`, `delete-confirm-dialog.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `View Layer`** (3 nodes): `InputFileControll()`, `input-file-controll.tsx`, `input-file-controll.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Resource Management`** (3 nodes): `theme-toggle.tsx`, `theme-toggle.tsx`, `toggleTheme()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Asset Handling`** (3 nodes): `button.tsx`, `button.tsx`, `cn()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Configuration Management`** (3 nodes): `skeleton.tsx`, `skeleton.tsx`, `Skeleton()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `User Interface Logic`** (3 nodes): `field.tsx`, `field.tsx`, `cn()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Application Architecture`** (3 nodes): `tooltip-button.tsx`, `tooltip-button.tsx`, `TooltipButton()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Backend Integration`** (3 nodes): `dropdown-menu.tsx`, `dropdown-menu.tsx`, `DropdownMenuPortal()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Frontend Development`** (3 nodes): `label.tsx`, `label.tsx`, `cn()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Software Engineering`** (3 nodes): `dialog.tsx`, `dialog.tsx`, `cn()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Project Management`** (3 nodes): `smart-office-icon.tsx`, `smart-office-icon.tsx`, `SmartOfficeIcon()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Documentation`** (3 nodes): `input.tsx`, `input.tsx`, `Input()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Testing`** (3 nodes): `logo.tsx`, `logo.tsx`, `Logo()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Deployment`** (3 nodes): `switch.tsx`, `switch.tsx`, `Switch()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 76`** (3 nodes): `audit-trail-info.tsx`, `audit-trail-info.tsx`, `AuditTrailInfo()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 77`** (3 nodes): `textarea.tsx`, `textarea.tsx`, `cn()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 78`** (3 nodes): `footer.tsx`, `Footer()`, `footer.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Are the 2 inferred relationships involving `doLogin()` (e.g. with `isEmailValid()` and `createSession()`) actually correct?**
  _`doLogin()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **Are the 3 inferred relationships involving `logout()` (e.g. with `getSession()` and `getAppwriteSession()`) actually correct?**
  _`logout()` has 3 INFERRED edges - model-reasoned connections that need verification._
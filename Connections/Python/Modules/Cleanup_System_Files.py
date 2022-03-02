from os import listdir, path, stat, unlink, scandir, lstat
from shutil import rmtree

class Clean_System_Files:
    def __init__(self):
        # * Define Variables
        Secondary_Applications_Folder = '/Applications'
        System_Application_Folder = '/System/Applications'
        System_Apps = [SysApp for SysApp in listdir(System_Application_Folder) if SysApp.endswith(".app")]
        Application = [App for App in listdir(Secondary_Applications_Folder) if App.endswith(".app")]
        Log_Path = path.expanduser('~/Library/Logs')
        self.Language_File_Path_List = []

        self.Languages_File_Size = 0
        self.Log_File_Size = 0

        self.Log_File_Path = []
        self.Log_File_Folder_Path = []

        def Check_Language_File(self, Application_Path, Filename):
            Language_File_Path = path.join(Application_Path, Filename)
            Type_of_Language_File = Filename.split('.')

            if all([path.isdir(Language_File_Path),
                    Type_of_Language_File[-1] == 'lproj',
                    Type_of_Language_File[0] not in Languages_to_Ignore]):
                self.Languages_File_Size += stat(Language_File_Path).st_size
                self.Language_File_Path_List.append(Language_File_Path)

        with open('./Connections/Python/Docs/Languages_to_Ignore.txt') as Lang_to_Ignore:
            Languages_to_Ignore_Readlines = Lang_to_Ignore.readlines()
            Languages_to_Ignore = [Each_Path.strip() for Each_Path in Languages_to_Ignore_Readlines]

        # * Check Log Files
        for Log_File in listdir(Log_Path):
            Log_File_Local_Path = path.join(Log_Path, Log_File)
            if path.isfile(Log_File_Local_Path) or \
               path.islink(Log_File_Local_Path):
                self.Log_File_Path.append(Log_File_Local_Path)
                try:
                    self.Log_File_Size += stat(Log_File_Local_Path).st_size
                except FileNotFoundError:
                    self.Log_File_Size += lstat(Log_File_Local_Path).st_size
            else:
                self.Log_File_Folder_Path.append(Log_File_Local_Path)
                self.Log_File_Size += path.getsize(Log_File_Local_Path)

        # * Check and Write paths of Language File
        for Each_Application in Application:
            Application_Path = path.join(Secondary_Applications_Folder,
                                         Each_Application, 'Contents/Resources')
            for Filename in listdir(Application_Path):
                Check_Language_File(self, Application_Path, Filename)

        for Each_System_Application in System_Apps:
            System_Application_Path = path.join(System_Application_Folder, Each_System_Application,
                                                'Contents/Resources')
            for System_Filename in listdir(System_Application_Path):
                Check_Language_File(self, System_Application_Path, System_Filename)

    def __enter__(self):
        return self

    def __exit__(Language_Path, self1, self2, self3):
        pass

    def Clear_Language_Files(self):
        for File in self.Language_File_Path_List:
            rmtree(File)

    def Clear_Log_File(self):
        for Log_file in self.Log_File_Path:
            unlink(Log_file)

        for Log_Folder in self.Log_File_Folder_Path:
            rmtree(Log_Folder)

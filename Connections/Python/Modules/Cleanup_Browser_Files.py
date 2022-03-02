import os
from shutil import rmtree
from configparser import ConfigParser


class Cleanup_Browser_Files:
    # @param of Class (OS_Platform)

    def __init__(self):
        # * Define Variables
        Warnings = []
        File_List = []

        self.History_Paths = []
        self.Size_of_Browser_Files = 0

        Config = ConfigParser()
        Config.read('System-Info.ini')

        def Append_Cache(self, Type_of_Cache):
            for Filename in os.listdir(Type_of_Cache):
                File_Path = os.path.join(Type_of_Cache, Filename)
                self.Size_of_Browser_Files += os.stat(File_Path).st_size
                self.History_Paths.append(File_Path)

        # * Chrome
        if Config.get('BROWSERS', 'Chrome_Installed'):
            if Config.get('SYSTEM-INFO', 'Platform') == 'Darwin':
                with open('./Connections/Python/Docs/Mac_OS_Chrome_Paths.txt') as Chrome_Paths_Open:
                    Chrome_Read = Chrome_Paths_Open.readlines()
                    Chrome_Paths_List = [Each_Path.strip() for Each_Path in
                                         Chrome_Read]
                for File in Chrome_Paths_List:
                    File_List.append(os.path.expanduser(File))

            elif Config.get('SYSTEM-INFO', 'Platform') == 'Win32':
                pass

            Main_Cache_of_Browser_of_Chrome = File_List[0]
            Cache_of_Code_of_Chrome = File_List[1]
            Cache_of_Code_of_Chrome_of_wasm = File_List[2]
            self.Browser_History_1_of_Chrome = File_List[3]
            self.Browser_History_2_of_Chrome = File_List[4]
            self.Cookies_1_of_Chrome = File_List[5]
            self.Cookies_2_of_Chrome = File_List[6]
            self.Bookmarks_1_of_Chrome = File_List[7]
            self.Bookmarks_2_of_Chrome = File_List[8]

            Append_Cache(self, Main_Cache_of_Browser_of_Chrome)
            Append_Cache(self, Cache_of_Code_of_Chrome)
            Append_Cache(self, Cache_of_Code_of_Chrome_of_wasm)

        if Config.get('BROWSERS', 'Firefox_Installed'):
            Warnings.append('Chrome not Installed')

        del File_List[:2]
        for Files in File_List:
            self.Size_of_Browser_Files += os.stat(Files).st_size

    def __enter__(self):
        return self

    def __exit__(self, self1, self2, self3):
        pass

    def Cleaner_of_Chrome(self, Clear_Browsing, Clear_Cache, Clear_Cookie,
                          Clear_Bookmark):
        # @param Clear_Browsing, Clear_Cache, Clear_Cookie, Clear_Bookmark

        if Clear_Browsing:
            os.remove(self.Browser_History_1_of_Chrome)
            os.remove(self.Browser_History_2_of_Chrome)

        if Clear_Cache:
            for File in self.History_Paths:
                os.remove(File)

        if Clear_Cookie:
            os.remove(self.Cookies_1_of_Chrome)
            os.remove(self.Cookies_2_of_Chrome)

        if Clear_Bookmark:
            os.remove(self.Bookmarks_1_of_Chrome)
            os.remove(self.Bookmarks_2_of_Chrome)

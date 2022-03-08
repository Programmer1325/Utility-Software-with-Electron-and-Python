from sys import argv, stdout
from json import loads

Argument = argv[1]

try:
    Second_Argument = argv[2]
except IndexError:
    Second_Argument = None

try:
    Third_Argument = argv[3]
except IndexError:
    Third_Argument = None

try:
    Fourth_Argument = argv[4]
except IndexError:
    Fourth_Argument = None

try:
    Fifth_Argument = argv[5]
except IndexError:
    Fifth_Argument = None


# --- Functions
def AddUnits(NumberInBytes):
    if NumberInBytes < 1024:
        return str(NumberInBytes) + " B"
    elif NumberInBytes < 1048576:
        return str(round(NumberInBytes / 1024, 2)) + " KB"
    elif NumberInBytes < 1073741824:
        return str(round(NumberInBytes / 1048576, 2)) + " MB"
    elif NumberInBytes < 1099511627776:
        return str(round(NumberInBytes / 1073741824, 2)) + " GB"


def EncryptDecryptOrDeleteFile(WhichOne):
    from Python.Modules.File_Handler import File_Handler

    with File_Handler(Second_Argument) as File:
        PathsList = loads(Third_Argument)['Paths']
        for Path in PathsList:
            if WhichOne == 'Encrypt':
                print(File.Encrypt_File(Path))
            elif WhichOne == 'Decrypt':
                print(File.Decrypt_File(Path))
            elif WhichOne == 'Delete':
                print(File.Delete_File(Path))

# --- Linkers


if Argument == 'Create Password':
    from Python.Modules.Password_Checker_And_Generator import Password
    with Password() as Password:
        print(Password.Password_Generator())

elif Argument == 'Get Size of Junk':
    from Python.Modules.Cleanup_System_Files import Clean_System_Files
    from Python.Modules.Cleanup_Browser_Files import Cleanup_Browser_Files

    Size = 0
    with Clean_System_Files() as SysFileSize:
        Size += SysFileSize.Log_File_Size + SysFileSize.Languages_File_Size

    with Cleanup_Browser_Files() as BrowserFiles:
        Size += BrowserFiles.Size_of_Browser_Files

    print(AddUnits(Size))

if Argument == 'Task Manager':
    from Python.Modules.System_Utility import Task_Manager

    with Task_Manager() as Task_Manager:
        Task_Manager.Get_Load_of_System(Second_Argument)

        print('No Result')

elif Argument == 'Password Checker':
    from Python.Modules.Password_Checker_And_Generator import Password

    with Password() as Password_Checker:
        Guesses, Time, Score, Feedback = Password_Checker.Password_Analyser(
            Second_Argument)
        if Feedback == '':
            Feedback = 'No Feedback'

        print(Score)
        print(Guesses)
        print(Time)
        print(Feedback)

elif Argument == 'Initial Password':
    from Python.Modules.Password_Manager import Password_Manager

    with Password_Manager(Second_Argument) as Manager:
        print(Manager.Get_Path())

elif Argument == 'Read Key':
    from Python.Modules.Password_Manager import Password_Manager
    if Second_Argument == '':
        print('Please select a key')
    else:
        with Password_Manager(Second_Argument) as Manager:
            print(Manager.Read_Key(Third_Argument))

elif Argument == 'Edit Key':
    from Python.Modules.Password_Manager import Password_Manager

    if Second_Argument == '':
        print('Please select a key')
    else:
        with Password_Manager(Second_Argument) as Manager:
            print(Manager.Edit_Key(Third_Argument,
                  Fourth_Argument, Fifth_Argument))

elif Argument == 'Create Key':
    from Python.Modules.Password_Manager import Password_Manager

    with Password_Manager(Second_Argument) as Manager:
        print(Manager.Write_Password(
            Third_Argument, Fourth_Argument, Fifth_Argument))

elif Argument == 'Delete Key':
    from Python.Modules.Password_Manager import Password_Manager

    if Second_Argument == '':
        print('Please select a key')
    else:
        with Password_Manager(Second_Argument) as Manager:
            print(Manager.Delete_Key(Third_Argument))

elif Argument == 'Encrypt File':
    EncryptDecryptOrDeleteFile('Encrypt')

elif Argument == 'Decrypt File':
    EncryptDecryptOrDeleteFile('Decrypt')

elif Argument == 'Delete File':
    EncryptDecryptOrDeleteFile('Delete')

stdout.flush()

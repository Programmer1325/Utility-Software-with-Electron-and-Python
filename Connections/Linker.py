from sys import argv, stdout

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

    if Size <= 1000000:
        Size = str(round(Size / 1000, 2))
        Size += 'KB'

    elif Size <= 1000000000:
        Size = str(round(Size / 1000000, 2))
        Size += 'MB'

    elif Size <= 1000000000000:
        Size = str(round(Size / 1000000000, 2))
        Size += 'GB'

    print(Size)

# * These are for the Second Argument

if Second_Argument == 'Task Manager':
    from Python.Modules.System_Utility import Task_Manager

    with Task_Manager() as Task_Manager:
        Task_Manager.Get_Load_of_System(Argument)

        print('No Result')

elif Second_Argument == 'Password Checker':
    from Python.Modules.Password_Checker_And_Generator import Password

    with Password(Argument) as Password_Checker:
        Guesses, Time, Score, Feedback = Password_Checker.Password_Analyser()
        if Feedback == '':
            Feedback = 'No Feedback'

        print(Score)
        print(Guesses)
        print(Time)
        print(Feedback)

elif Second_Argument == 'Initial Password':
    from Python.Modules.Password_Manager import Password_Manager

    with Password_Manager(Argument) as Manager:
        print(Manager.Get_Path())

elif Second_Argument == 'Read Key':
    from Python.Modules.Password_Manager import Password_Manager
    if Argument == '':
        print('Please select a key')
    else:
        with Password_Manager(Argument) as Manager:
            print(Manager.Read_Key(Third_Argument))

elif Second_Argument == 'Edit Key':
    from Python.Modules.Password_Manager import Password_Manager

    if Argument == '':
        print('Please select a key')
    else:
        with Password_Manager(Argument) as Manager:
            print(Manager.Edit_Key(Third_Argument,
                  Fourth_Argument, Fifth_Argument))

elif Second_Argument == 'Create Key':
    from Python.Modules.Password_Manager import Password_Manager

    with Password_Manager(Argument) as Manager:
        print(Manager.Write_Password(
            Third_Argument, Fourth_Argument, Fifth_Argument))

elif Second_Argument == 'Delete Key':
    from Python.Modules.Password_Manager import Password_Manager

    if Argument == '':
        print('Please select a key')
    else:
        with Password_Manager(Argument) as Manager:
            print(Manager.Delete_Key(Third_Argument))

stdout.flush()

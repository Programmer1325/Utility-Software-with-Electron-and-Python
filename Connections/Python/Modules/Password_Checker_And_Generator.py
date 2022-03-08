from zxcvbn import zxcvbn
from random import randrange, choice


class Password:
    def __init__(self):
        pass

    def __enter__(self):
        return self

    def __exit__(self, self2, self3, self4):
        pass

    def Password_Generator(self):
        with open('./Connections/Python/Docs/Adjectives.txt', 'r') as Adjectives_Opener:
            Adjectives = Adjectives_Opener.read().split(',')

        with open('./Connections/Python/Docs/Nouns.txt', 'r') as Nouns_Opener:
            Nouns = Nouns_Opener.read().split(',')

        with open('./Connections/Python/Docs/Colours.txt', 'r') as Colours_Opener:
            Colours = Colours_Opener.read().split(',')

        with open('./Connections/Python/Docs/Vegetables.txt', 'r') as Vegetables_Opener:
            Vegetables = Vegetables_Opener.read().split(',')

        adjective = choice(Adjectives)
        noun = choice(Nouns)
        colour = choice(Colours)
        vegetable = choice(Vegetables)
        number = randrange(0, 100)

        Generated_Password = adjective + noun + \
            colour + vegetable + str(number)

        return Generated_Password

    def Password_Analyser(self, Input_Password):
        # * Output
        Result = zxcvbn(Input_Password)

        # * Number of Guesses required
        Guesses = str(Result['guesses'])

        # * Time required to crack the code (Using offline_slow_hashing_1e4_per_second. Can use others if needed)
        Time = Result['crack_times_display']['offline_fast_hashing_1e10_per_second']

        # * Score which shows how strong the Password is
        Score = Result['score']

        # * Feedback on how to improve passwords
        Feedback = Result['feedback']['warning']

        return Guesses, Time, Score, Feedback

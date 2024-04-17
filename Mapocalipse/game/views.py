from django.shortcuts import render

def homepage(request):
    return render(request, 'homepage.html')


def game(request):
    return render(request, 'game.html')

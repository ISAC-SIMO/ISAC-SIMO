# Authorize Users to check user passes test in view

login_url = '/login/?error=unauthorized'

def is_admin(user):
    if user and user.is_authenticated:
        return user.is_active and user.is_admin
    return False

def is_engineer(user):
    if user and user.is_authenticated:
        return user.is_active and user.is_engineer
    return False

def is_government(user):
    if user and user.is_authenticated:
        return user.is_active and user.is_government
    return False

def is_user(user):
    if user and user.is_authenticated:
        return user.is_active and user.is_user
    return False
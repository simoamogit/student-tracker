import datetime
from dateutil.relativedelta import relativedelta

def get_current_school_year():
    """
    Restituisce l'anno scolastico corrente nel formato 'YYYY-YYYY'
    L'anno scolastico inizia a settembre e termina ad agosto dell'anno successivo
    """
    today = datetime.datetime.now()
    if today.month >= 9:  # Da settembre a dicembre
        return f"{today.year}-{today.year + 1}"
    else:  # Da gennaio ad agosto
        return f"{today.year - 1}-{today.year}"

def get_semester(date):
    """
    Restituisce il semestre (1 o 2) in base alla data
    Il primo semestre va da settembre a gennaio, il secondo da febbraio a giugno
    """
    if isinstance(date, str):
        date = datetime.datetime.fromisoformat(date)
    
    # Determina l'anno scolastico
    school_year = get_current_school_year()
    start_year = int(school_year.split('-')[0])
    
    # Primo semestre: settembre - gennaio
    if (date.month >= 9 and date.year == start_year) or (date.month <= 1 and date.year == start_year + 1):
        return 1
    # Secondo semestre: febbraio - giugno
    elif date.month >= 2 and date.month <= 6 and date.year == start_year + 1:
        return 2
    else:
        return None  # Periodo estivo (luglio-agosto)

def get_day_name(day_number):
    """
    Restituisce il nome del giorno della settimana in italiano
    day_number: 0 (lunedì) - 6 (domenica)
    """
    days = ["Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato", "Domenica"]
    return days[day_number]

def format_date(date_str, format_str="%d/%m/%Y"):
    """
    Formatta una data ISO in un formato più leggibile
    """
    if not date_str:
        return ""
    date_obj = datetime.datetime.fromisoformat(date_str)
    return date_obj.strftime(format_str)
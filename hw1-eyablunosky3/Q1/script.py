from __future__ import print_function
import sys
import time
import json
import requests

DEBUG_PRINT = False
ESCAPE_CSV_CHARS = False
q1b_outname = 'movie_ID_name.csv'
q1c_outname = 'movie_ID_sim_movie_ID.csv'
api_key = ''
SLEEP_DURATION = 10  # seconds
MAX_REQUESTS = 40

def debug_print(string=''):
    if DEBUG_PRINT:
        print(string)

# Get api key from file if not given by command line
if len(sys.argv) > 1:
    debug_print('reading api key from command line')
    api_key = sys.argv[1]
else:
    debug_print('reading api key from api_key.txt')
    with open('./api_key.txt', 'r') as f:
        api_key = f.read()

debug_print('api key: <{}>'.format(api_key))


def throttle_requests():
    request_count = 0
    last_sleep_time = time.time()
    while True:
        if request_count >= (MAX_REQUESTS):
            actual_sleep_duration = max(
                last_sleep_time + SLEEP_DURATION - time.time(),
                0) + 0.5
            debug_print('\n\nSleeping for {}s.\n\n'.format(actual_sleep_duration))
            time.sleep(actual_sleep_duration)
            last_sleep_time = time.time()
            request_count = 1
            yield
        else:
            debug_print('Not Sleeping. {0} requests made'.format(request_count))
            request_count += 1
            yield
throttler = throttle_requests()

def write_lines(filename, lines):
    with open(filename, 'w') as f:
        f.write('\n'.join(lines))


def escape_csv_chars(string):
    if not ESCAPE_CSV_CHARS:
        return str(string)
        
    string = str(string)
    quote = False
    if len(set(',"\r\n\v') & set(string)) > 0:
        string = string.replace('"', '""')
        quote = True
    if quote:
        return '"{}"'.format(string)
    return string


def unescape_csv_chars(string=''):
    if not ESCAPE_CSV_CHARS:
        return str(string)
    if not (string.startswith('"') and string.endswith('"')):
        return string
    return string[1:-1].replace('""', '"')


def get_movie_results(page):
    url = 'https://api.themoviedb.org/3/discover/movie'
    payload = {'api_key': api_key,
               'sort_by': 'popularity.desc',
               'page': page,
               'primary_release_date.gte': '2000-01-01',
               'with_genres': 35
               }

    next(throttler)
    response = requests.request('GET', url, data=payload)
    response_json = response.json()
    return response_json['results']


def get_q1b_lines(movie_results):
    lines = list()
    for movie_result in movie_results:
        movie_title = escape_csv_chars(movie_result['title'])
        lines.append('{},{}'.format(movie_result['id'], movie_title))

    return lines


def q1b():
    movie_results = list()
    page = 1
    while len(movie_results) <= 300:
        movie_results.extend(get_movie_results(page))
        page += 1
    movie_results = movie_results[0:300]
    lines = get_q1b_lines(movie_results)
    write_lines('./' + q1b_outname, lines)


def read_movie_list():
    data = list()
    raw_data = ''
    with open('./' + q1b_outname, 'r') as f:
        raw_data = f.read()
    for line in raw_data.splitlines():
        comma_index = line.find(',')
        movie_id = int(line[0:comma_index])
        movie_name = unescape_csv_chars(line[comma_index + 1:])
        data.append([movie_id, movie_name])
        debug_print('{}\t{}'.format(movie_id, movie_name))
    return data


def get_similar_movie_ids(movie_id, max_movies=5):
    similar_movie_ids = list()
    url = 'https://api.themoviedb.org/3/movie/{}/similar'.format(movie_id)
    payload = {'api_key': api_key, 'page': '1'}
    next(throttler)
    response_json = requests.request('GET', url, data=payload).json()
    for i in range(max_movies):
        result = response_json['results']
        if len(result) == 0 or len(result) <= i:
            break
        similar_movie_ids.append(result[i]['id'])
        debug_print('\t{}'.format(result[i]['id']))
    return similar_movie_ids


def build_similar_movie_list():
    movies = read_movie_list()
    similar_movies = list()
    for movie in movies:
        movie_id = movie[0]
        debug_print('{} ({})'.format(movie[1], movie[0]))
        similar_movie_ids = get_similar_movie_ids(movie_id)
        for similar_movie_id in similar_movie_ids:
            if set([similar_movie_id, movie_id]) in [set(m) for m in similar_movies]:
                # Don't add duplicate reverse links.
                debug_print('\t{},{}\tpair already exists!'.format(similar_movie_id, movie_id))
                continue
            similar_movies.append([movie_id, similar_movie_id])
        debug_print()
    return similar_movies


def q1c():
    similar_movies = build_similar_movie_list()
    lines = list()
    for movie_pair in similar_movies:
        movie_pair = [escape_csv_chars(p) for p in movie_pair]
        lines.append('{},{}'.format(movie_pair[0], movie_pair[1]))
    write_lines('./'+q1c_outname, lines)


def main():
    q1b()
    q1c()

if __name__ == '__main__':
    main()

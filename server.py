# python3

from flask import (Flask, request, make_response)
from flask_cors import CORS

import game
import errors
from store import store_instance


app = Flask('ssh-test-application')
CORS(app)  # Enable CORS for all routes



@app.route('/api/v1/games', methods=['GET', 'POST'])
def games():
    if request.method == 'GET':
        json_games = [g.get_json() for g in store_instance.get_games()]
        return make_response({'games': json_games})

    if request.method == 'POST':
        if request.is_json:
            board = request.get_json().get('board')
        else:
            return make_response({'error': 'Invalid request'}, 400)

        game_obj = game.Game()
        ok, error = game_obj.update_board(board)
        if not ok:
            return make_response(
                {'error': error},
                errors.get_error_code(error))

        ok, error = store_instance.add_game(game_obj)
        if not ok:
            return make_response(
                {'error': error},
                errors.get_error_code(error))

        resp = make_response(game_obj.get_json(), 201)
        resp.headers['Location'] = 'api/vi/games/' + game_obj.id
        return resp

    return make_response(
        {'error': errors.method_not_allowed},
        errors.get_error_code(errors.method_not_allowed))


@app.route('/api/v1/games/<game_id>', methods=['GET', 'PUT', 'DELETE'])
def game_id(game_id):
    if request.method == 'GET':
        game_obj = store_instance.get_game(game_id)
        if game_obj is None:
            return make_response(
                {'error': errors.not_found_error},
                errors.get_error_code(errors.not_found_error))
        return make_response(game_obj.get_json())

    if request.method == 'PUT':
        if request.is_json:
            board = request.get_json().get('board')
        else:
            return make_response({'error': 'Invalid request'}, 400)

        game_obj = store_instance.get_game(game_id)
        if game_obj is None:
            return make_response(
                {'error': errors.not_found_error},
                errors.get_error_code(errors.not_found_error))

        if game_obj.is_finished():
            return make_response(
                {'error': errors.game_finished},
                errors.get_error_code(errors.game_finished))

        ok, error = game_obj.update_board(board)
        if not ok:
            return make_response(
                {'error': error},
                errors.get_error_code(error))

        ok, error = store_instance.update_game(game_id, game_obj)
        if not ok:
            return make_response(
                {'error': error},
                errors.get_error_code(error))

        return make_response(game_obj.get_json())

    if request.method == 'DELETE':
        ok, error = store_instance.delete_game(game_id)
        if not ok:
            return make_response(
                {'error': error},
                errors.get_error_code(error))

        return make_response({})

    return make_response({'error': 'Method not allowed'}, 405)


if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)

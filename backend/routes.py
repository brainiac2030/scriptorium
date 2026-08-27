from flask import Blueprint, request, jsonify, make_response
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from models import db, User, Collection, SavedBook, ReadingSession, BookQuote, ReadingGoal
from schemas import (
    user_schema, collection_schema, collections_schema, 
    saved_book_schema, saved_books_schema,
    reading_session_schema, reading_sessions_schema,
    book_quote_schema, book_quotes_schema,
    reading_goal_schema
)
from datetime import datetime

api = Blueprint('api', __name__, url_prefix='/api')

@api.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    
    errors = user_schema.validate(data)
    if errors:
        return make_response(jsonify({"errors": errors}), 400)

    if User.query.filter_by(username=data['username']).first():
        return make_response(jsonify({"error": "Username already exists"}), 400)
    
    if User.query.filter_by(email=data['email']).first():
        return make_response(jsonify({"error": "Email already exists"}), 400)

    new_user = User(username=data['username'], email=data['email'])
    new_user.set_password(data['password'])
    
    db.session.add(new_user)
    db.session.commit()

    access_token = create_access_token(identity=str(new_user.id))
    
    return make_response(jsonify({
        "user": user_schema.dump(new_user),
        "token": access_token
    }), 201)

@api.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data.get('email')).first()

    if user and user.check_password(data.get('password')):
        access_token = create_access_token(identity=str(user.id))
        return make_response(jsonify({
            "user": user_schema.dump(user),
            "token": access_token
        }), 200)
    
    return make_response(jsonify({"error": "Invalid email or password"}), 401)

@api.route('/me', methods=['GET'])
@jwt_required()
def me():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    if user:
        return make_response(jsonify(user_schema.dump(user)), 200)
    return make_response(jsonify({"error": "User not found"}), 404)

# ==========================================
# COLLECTIONS CRUD ROUTES
# ==========================================

@api.route('/collections', methods=['GET'])
@jwt_required()
def get_collections():
    try:
        current_user_id = int(get_jwt_identity())
        user_collections = Collection.query.filter_by(user_id=current_user_id).all()
        return make_response(jsonify(collections_schema.dump(user_collections)), 200)
    except Exception as e:
        print(f"Error in get_collections: {str(e)}")
        return make_response(jsonify({"error": str(e)}), 500)

@api.route('/collections', methods=['POST'])
@jwt_required()
def create_collection():
    try:
        current_user_id = int(get_jwt_identity())
        data = request.get_json()
        
        errors = collection_schema.validate(data)
        if errors:
            return make_response(jsonify({"errors": errors}), 400)

        new_collection = Collection(
            user_id=current_user_id,
            name=data['name'],
            description=data.get('description')
        )
        
        db.session.add(new_collection)
        db.session.commit()
        
        return make_response(jsonify(collection_schema.dump(new_collection)), 201)
    except Exception as e:
        print(f"Error in create_collection: {str(e)}")
        return make_response(jsonify({"error": str(e)}), 500)

@api.route('/collections/<int:id>', methods=['GET'])
@jwt_required()
def get_collection(id):
    try:
        current_user_id = int(get_jwt_identity())
        collection = Collection.query.get(id)
        
        if not collection or collection.user_id != current_user_id:
            return make_response(jsonify({"error": "Collection not found"}), 404)
        
        return make_response(jsonify(collection_schema.dump(collection)), 200)
    except Exception as e:
        print(f"Error in get_collection: {str(e)}")
        return make_response(jsonify({"error": str(e)}), 500)

@api.route('/collections/<int:id>', methods=['PUT'])
@jwt_required()
def update_collection(id):
    try:
        current_user_id = int(get_jwt_identity())
        collection = Collection.query.get(id)
        
        if not collection or collection.user_id != current_user_id:
            return make_response(jsonify({"error": "Unauthorized or collection not found"}), 403)

        data = request.get_json()
        errors = collection_schema.validate(data)
        if errors:
            return make_response(jsonify({"errors": errors}), 400)

        collection.name = data.get('name', collection.name)
        collection.description = data.get('description', collection.description)
        
        db.session.commit()
        return make_response(jsonify(collection_schema.dump(collection)), 200)
    except Exception as e:
        print(f"Error in update_collection: {str(e)}")
        return make_response(jsonify({"error": str(e)}), 500)

@api.route('/collections/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_collection(id):
    try:
        current_user_id = int(get_jwt_identity())
        collection = Collection.query.get(id)
        
        if not collection or collection.user_id != current_user_id:
            return make_response(jsonify({"error": "Unauthorized or collection not found"}), 403)

        db.session.delete(collection)
        db.session.commit()
        return make_response(jsonify({"message": "Collection deleted successfully"}), 200)
    except Exception as e:
        print(f"Error in delete_collection: {str(e)}")
        return make_response(jsonify({"error": str(e)}), 500)

@api.route('/collections/<int:id>/books', methods=['GET'])
@jwt_required()
def get_collection_books(id):
    try:
        current_user_id = int(get_jwt_identity())
        collection = Collection.query.get(id)
        
        if not collection or collection.user_id != current_user_id:
            return make_response(jsonify({"error": "Collection not found"}), 404)
        
        books = SavedBook.query.filter_by(collection_id=id).order_by(SavedBook.added_at.desc()).all()
        return make_response(jsonify(saved_books_schema.dump(books)), 200)
    except Exception as e:
        print(f"Error in get_collection_books: {str(e)}")
        return make_response(jsonify({"error": str(e)}), 500)

# ==========================================
# SAVED BOOKS ROUTES
# ==========================================

@api.route('/saved_books', methods=['GET'])
@jwt_required()
def get_saved_books():
    try:
        current_user_id = int(get_jwt_identity())
        user_books = SavedBook.query.filter_by(user_id=current_user_id).all()
        return make_response(jsonify(saved_books_schema.dump(user_books)), 200)
    except Exception as e:
        print(f"Error in get_saved_books: {str(e)}")
        return make_response(jsonify({"error": str(e)}), 500)

@api.route('/saved_books', methods=['POST'])
@jwt_required()
def add_saved_book():
    try:
        current_user_id = int(get_jwt_identity())
        data = request.get_json()
        
        # Validate required fields manually
        if not data.get('collection_id'):
            return make_response(jsonify({"error": "collection_id is required"}), 400)
        if not data.get('work_key'):
            return make_response(jsonify({"error": "work_key is required"}), 400)
        if not data.get('title'):
            return make_response(jsonify({"error": "title is required"}), 400)
        if not data.get('author'):
            return make_response(jsonify({"error": "author is required"}), 400)
        
        collection = Collection.query.get(data['collection_id'])
        if not collection or collection.user_id != current_user_id:
            return make_response(jsonify({"error": "Invalid collection or unauthorized"}), 403)

        # Check if book already exists in this collection
        existing_book = SavedBook.query.filter_by(
            user_id=current_user_id,
            collection_id=data['collection_id'],
            work_key=data['work_key']
        ).first()
        
        if existing_book:
            return make_response(jsonify({"error": "Book already in this collection"}), 400)

        new_book = SavedBook(
            user_id=current_user_id,
            collection_id=data['collection_id'],
            work_key=data['work_key'],
            title=data['title'],
            author=data['author'],
            cover_id=data.get('cover_id'),
            status=data.get('status', 'to_read'),
            notes=data.get('notes'),
            total_pages=data.get('total_pages'),
            current_page=data.get('current_page', 0)
        )
        
        db.session.add(new_book)
        db.session.commit()
        
        return make_response(jsonify(saved_book_schema.dump(new_book)), 201)
    except Exception as e:
        print(f"Error in add_saved_book: {str(e)}")
        db.session.rollback()
        return make_response(jsonify({"error": str(e)}), 500)

@api.route('/saved_books/<int:id>', methods=['PUT'])
@jwt_required()
def  update_saved_book(id):
    try:
        current_user_id = int(get_jwt_identity())
        book = SavedBook.query.get(id)
        
        if not book or book.user_id != current_user_id:
            return make_response(jsonify({"error": "Unauthorized or book not found"}), 403)
        
        data = request.get_json()
        
        if 'status' in data:
            if data['status'] not in ['to_read', 'reading', 'finished']:
                return make_response(jsonify({"error": "Invalid status"}), 400)
            book.status = data['status']
        
        if 'notes' in data:
            book.notes = data['notes']
        
        if 'current_page' in data:
            book.current_page = data['current_page']
            
            if book.total_pages and book.current_page >= book.total_pages:
                book.status = 'finished'
                book.finish_date = datetime.utcnow()
            elif book.current_page > 0 and book.status == 'to_read':
                book.status = 'reading'
                if not book.start_date:
                    book.start_date = datetime.utcnow()
        
        db.session.commit()
        return make_response(jsonify(saved_book_schema.dump(book)), 200)
    except Exception as e:
        print(f"Error in update_saved_book: {str(e)}")
        return make_response(jsonify({"error": str(e)}), 500)

@api.route('/saved_books/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_saved_book(id):
    try:
        current_user_id = int(get_jwt_identity())
        book = SavedBook.query.get(id)
        
        if not book or book.user_id != current_user_id:
            return make_response(jsonify({"error": "Unauthorized or book not found"}), 403)
        
        db.session.delete(book)
        db.session.commit()
        return make_response(jsonify({"message": "Book removed from collection"}), 200)
    except Exception as e:
        print(f"Error in delete_saved_book: {str(e)}")
        return make_response(jsonify({"error": str(e)}), 500)

# ==========================================
# READING PROGRESS & SESSIONS
# ==========================================

@api.route('/saved_books/<int:id>/update-progress', methods=['PUT'])
@jwt_required()
def update_reading_progress(id):
    try:
        current_user_id = int(get_jwt_identity())
        book = SavedBook.query.get(id)
        
        if not book or book.user_id != current_user_id:
            return make_response(jsonify({"error": "Book not found"}), 404)
        
        data = request.get_json()
        
        if 'current_page' in data:
            book.current_page = data['current_page']
            
            if book.total_pages and book.current_page >= book.total_pages:
                book.status = 'finished'
                book.finish_date = datetime.utcnow()
            elif book.current_page > 0 and book.status == 'to_read':
                book.status = 'reading'
                if not book.start_date:
                    book.start_date = datetime.utcnow()
        
        db.session.commit()
        return make_response(jsonify(saved_book_schema.dump(book)), 200)
    except Exception as e:
        print(f"Error in update_reading_progress: {str(e)}")
        return make_response(jsonify({"error": str(e)}), 500)

@api.route('/saved_books/<int:id>/sessions', methods=['GET'])
@jwt_required()
def get_book_sessions(id):
    try:
        current_user_id = int(get_jwt_identity())
        book = SavedBook.query.get(id)
        
        if not book or book.user_id != current_user_id:
            return make_response(jsonify({"error": "Book not found"}), 404)
        
        sessions = ReadingSession.query.filter_by(book_id=id).order_by(ReadingSession.date.desc()).all()
        return make_response(jsonify(reading_sessions_schema.dump(sessions)), 200)
    except Exception as e:
        print(f"Error in get_book_sessions: {str(e)}")
        return make_response(jsonify({"error": str(e)}), 500)

@api.route('/saved_books/<int:id>/sessions', methods=['POST'])
@jwt_required()
def log_reading_session(id):
    try:
        current_user_id = int(get_jwt_identity())
        book = SavedBook.query.get(id)
        
        if not book or book.user_id != current_user_id:
            return make_response(jsonify({"error": "Book not found"}), 404)
        
        data = request.get_json()
        
        # Validate required fields
        if not data.get('duration_minutes'):
            return make_response(jsonify({"error": "duration_minutes is required"}), 400)
        if not data.get('pages_read'):
            return make_response(jsonify({"error": "pages_read is required"}), 400)
        
        session = ReadingSession(
            user_id=current_user_id,
            book_id=id,
            duration_minutes=data['duration_minutes'],
            pages_read=data['pages_read'],
            notes=data.get('notes')
        )
        
        book.current_page = (book.current_page or 0) + data['pages_read']
        if book.total_pages and book.current_page >= book.total_pages:
            book.status = 'finished'
            book.finish_date = datetime.utcnow()
        elif book.current_page > 0 and book.status == 'to_read':
            book.status = 'reading'
            if not book.start_date:
                book.start_date = datetime.utcnow()
        
        db.session.add(session)
        db.session.commit()
        
        return make_response(jsonify(reading_session_schema.dump(session)), 201)
    except Exception as e:
        print(f"Error in log_reading_session: {str(e)}")
        db.session.rollback()
        return make_response(jsonify({"error": str(e)}), 500)

# ==========================================
# QUOTES
# ==========================================

@api.route('/saved_books/<int:id>/quotes', methods=['GET'])
@jwt_required()
def get_book_quotes(id):
    try:
        current_user_id = int(get_jwt_identity())
        book = SavedBook.query.get(id)
        
        if not book or book.user_id != current_user_id:
            return make_response(jsonify({"error": "Book not found"}), 404)
        
        quotes = BookQuote.query.filter_by(book_id=id).order_by(BookQuote.created_at.desc()).all()
        return make_response(jsonify(book_quotes_schema.dump(quotes)), 200)
    except Exception as e:
        print(f"Error in get_book_quotes: {str(e)}")
        return make_response(jsonify({"error": str(e)}), 500)

@api.route('/saved_books/<int:id>/quotes', methods=['POST'])
@jwt_required()
def add_quote(id):
    try:
        current_user_id = int(get_jwt_identity())
        book = SavedBook.query.get(id)
        
        if not book or book.user_id != current_user_id:
            return make_response(jsonify({"error": "Book not found"}), 404)
        
        data = request.get_json()
        
        if not data.get('content'):
            return make_response(jsonify({"error": "content is required"}), 400)
        
        quote = BookQuote(
            user_id=current_user_id,
            book_id=id,
            content=data['content'],
            page_number=data.get('page_number')
        )
        
        db.session.add(quote)
        db.session.commit()
        
        return make_response(jsonify(book_quote_schema.dump(quote)), 201)
    except Exception as e:
        print(f"Error in add_quote: {str(e)}")
        return make_response(jsonify({"error": str(e)}), 500)

# ==========================================
# READING GOALS & STATISTICS
# ==========================================

@api.route('/users/me/stats', methods=['GET'])
@jwt_required()
def get_user_stats():
    try:
        current_user_id = int(get_jwt_identity())
        
        books = SavedBook.query.filter_by(user_id=current_user_id).all()
        
        total_books = len(books)
        books_finished = len([b for b in books if b.status == 'finished'])
        books_reading = len([b for b in books if b.status == 'reading'])
        total_pages_read = sum([b.current_page or 0 for b in books])
        
        current_year = datetime.utcnow().year
        goal = ReadingGoal.query.filter_by(user_id=current_user_id, year=current_year).first()
        
        sessions = ReadingSession.query.filter_by(user_id=current_user_id).all()
        
        return make_response(jsonify({
            "total_books": total_books,
            "books_finished": books_finished,
            "books_reading": books_reading,
            "total_pages_read": total_pages_read,
            "goal": reading_goal_schema.dump(goal) if goal else None,
            "reading_streak": len(sessions) if sessions else 0
        }), 200)
    except Exception as e:
        print(f"Error in get_user_stats: {str(e)}")
        return make_response(jsonify({"error": str(e)}), 500)

@api.route('/users/me/goals', methods=['GET'])
@jwt_required()
def get_goal():
    try:
        current_user_id = int(get_jwt_identity())
        current_year = datetime.utcnow().year
        goal = ReadingGoal.query.filter_by(user_id=current_user_id, year=current_year).first()
        
        if goal:
            return make_response(jsonify(reading_goal_schema.dump(goal)), 200)
        return make_response(jsonify({"message": "No goal set for this year"}), 404)
    except Exception as e:
        print(f"Error in get_goal: {str(e)}")
        return make_response(jsonify({"error": str(e)}), 500)

@api.route('/users/me/goals', methods=['POST'])
@jwt_required()
def set_goal():
    try:
        current_user_id = int(get_jwt_identity())
        current_year = datetime.utcnow().year
        data = request.get_json()
        
        if not data.get('books_target'):
            return make_response(jsonify({"error": "books_target is required"}), 400)
        
        goal = ReadingGoal.query.filter_by(user_id=current_user_id, year=current_year).first()
        if goal:
            goal.books_target = data['books_target']
            goal.pages_target = data.get('pages_target')
        else:
            goal = ReadingGoal(
                user_id=current_user_id,
                year=current_year,
                books_target=data['books_target'],
                pages_target=data.get('pages_target')
            )
            db.session.add(goal)
        
        db.session.commit()
        return make_response(jsonify(reading_goal_schema.dump(goal)), 200)
    except Exception as e:
        print(f"Error in set_goal: {str(e)}")
        db.session.rollback()
        return make_response(jsonify({"error": str(e)}), 500)
from marshmallow import Schema, fields, validate

class UserSchema(Schema):
    id = fields.Int(dump_only=True)
    username = fields.Str(required=True, validate=validate.Length(min=3, max=80))
    email = fields.Str(required=True, validate=validate.Email())
    password = fields.Str(required=True, load_only=True, validate=validate.Length(min=6))

class CollectionSchema(Schema):
    id = fields.Int(dump_only=True)
    user_id = fields.Int(dump_only=True)
    name = fields.Str(required=True, validate=validate.Length(min=1, max=100))
    description = fields.Str(allow_none=True)
    created_at = fields.DateTime(dump_only=True)

class ReadingSessionSchema(Schema):
    id = fields.Int(dump_only=True)
    user_id = fields.Int(dump_only=True)
    book_id = fields.Int(required=True)
    date = fields.DateTime(dump_only=True)
    duration_minutes = fields.Int(required=True)
    pages_read = fields.Int(required=True)
    notes = fields.Str(allow_none=True)

class BookQuoteSchema(Schema):
    id = fields.Int(dump_only=True)
    user_id = fields.Int(dump_only=True)
    book_id = fields.Int(required=True)
    content = fields.Str(required=True)
    page_number = fields.Int(allow_none=True)
    created_at = fields.DateTime(dump_only=True)

class ReadingGoalSchema(Schema):
    id = fields.Int(dump_only=True)
    user_id = fields.Int(dump_only=True)
    year = fields.Int(required=True)
    books_target = fields.Int(required=True)
    pages_target = fields.Int(allow_none=True)
    created_at = fields.DateTime(dump_only=True)

class SavedBookSchema(Schema):
    id = fields.Int(dump_only=True)
    user_id = fields.Int(dump_only=True)
    collection_id = fields.Int(required=True)
    work_key = fields.Str(required=True)
    title = fields.Str(required=True)
    author = fields.Str(required=True)
    cover_id = fields.Int(allow_none=True)
    total_pages = fields.Int(allow_none=True)
    current_page = fields.Int(allow_none=True)
    status = fields.Str(validate=validate.OneOf(['to_read', 'reading', 'finished']))
    rating = fields.Int(allow_none=True)
    notes = fields.Str(allow_none=True)
    start_date = fields.DateTime(allow_none=True)
    finish_date = fields.DateTime(allow_none=True)
    added_at = fields.DateTime(dump_only=True)
    reading_sessions = fields.Nested('ReadingSessionSchema', many=True, dump_only=True)

# Create schema instances
user_schema = UserSchema()
collection_schema = CollectionSchema()
collections_schema = CollectionSchema(many=True)
saved_book_schema = SavedBookSchema()
saved_books_schema = SavedBookSchema(many=True)
reading_session_schema = ReadingSessionSchema()
reading_sessions_schema = ReadingSessionSchema(many=True)
book_quote_schema = BookQuoteSchema()
book_quotes_schema = BookQuoteSchema(many=True)
reading_goal_schema = ReadingGoalSchema()
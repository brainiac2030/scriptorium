function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-6 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} PageTurner. Powered by Open Library.
      </div>
    </footer>
  );
}
export default Footer;
export default function NewsScroller() {
  return (
    <section className="bg-white py-8 px-4 border-t">
      <h2 className="text-xl font-semibold mb-4">Latest in Philippine Sailing</h2>
      <div className="overflow-x-auto whitespace-nowrap space-x-4">
        <span className="inline-block px-4 py-2 bg-gray-100 rounded">News Item 1</span>
        <span className="inline-block px-4 py-2 bg-gray-100 rounded">News Item 2</span>
        <span className="inline-block px-4 py-2 bg-gray-100 rounded">News Item 3</span>
      </div>
    </section>
  )
}

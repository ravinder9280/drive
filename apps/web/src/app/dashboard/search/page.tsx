import SearchResultClient from "./_components/SearchResultClient"

const SearchResultPage = async ({ searchParams }: { searchParams: Promise<{ query?: string }> }) => {
  const { query = '' } = await searchParams
  return <SearchResultClient query={query} />
}

export default SearchResultPage
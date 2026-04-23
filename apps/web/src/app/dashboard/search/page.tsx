import SearchResultClient from "./_components/SearchResultClient"

const SearchResultPage = ({ searchParams }: { searchParams: { query?: string } }) => {
    const query = searchParams.query || ''
  
    return (
        <SearchResultClient query={query} />
    )
  }
  
  export default SearchResultPage
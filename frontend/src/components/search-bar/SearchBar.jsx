import React, { useState } from 'react'
import { FaSearch } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import { filterItemSearch } from '../../store/slices/storeSlice';


const SearchBar = () => {

    const storeArray = useSelector(state => state.store.storeArr);
    const dispatch = useDispatch();

    const [searchValue, setSearchValue] = useState("");
    const [filteredData, setFilteredData] = useState(storeArray);

    console.log("filteredData from search bar--",filteredData);

    const search = (query) => {
        const filtered = storeArray.filter((item) => {
            return item.title.toLowerCase().includes(query.toLowerCase())
        })
        setFilteredData(filtered);
    }
    const searchHandler = (e) => {        
        setSearchValue(e.target.value);
        search(e.target.value);
    }
    const onClickTextHandler = (text) => {
        setSearchValue(text);
        setFilteredData([])
    }


    //handling search icon click
    const searchIconClickHandler = (value) => {
        dispatch(filterItemSearch(value));
    }

    const handleIconClick = (e) => {
        e.preventDefault();

        searchIconClickHandler(searchValue);
        setSearchValue("");
    }

  return (
    <>
    <div>
        <form className='flex items-center mb-2' onSubmit={handleIconClick}>
            <input placeholder='Search Items...' value={searchValue} onChange={searchHandler} className='w-[500px] p-2 outline-none focus:outline-yellow-400 text-xl' type="text" name="search-bar" id="search-bar" />
            <button type='submit' ><FaSearch className='-ml-10 hover:scale-110 transition-transform duration-300'/></button>
        </form>


        {filteredData.length > 0 && <>
            <div className='z-10 bg-white border-black'>
                {searchValue && filteredData.map((item, i) => (
                    <div className='border border-gray-400 cursor-pointer' key={i} onClick={() => onClickTextHandler(item.title)}>
                        <p className=' text-lg  ml-1' >{item.title}</p><hr className='bg-black'/>
                    </div>
                )).slice(0,5)}
            </div>
        </>}

    </div>
    </>
  )
}

export default SearchBar;
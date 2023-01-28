import * as React from 'react';

const initialStories = [
  {
    title: 'React',
    url: 'https://reactjs.org/',
    author: 'Jordan Walke',
    num_comments: 3,
    points: 4,
    objectID: 0,
  },
  {
    title: 'Redux',
    url: 'https://redux.js.org/',
    author: 'Dan Abramov, Andrew Clark',
    num_comments: 2,
    points: 5,
    objectID: 1,
  },
  {
    title: 'Redux2',
    url: 'https://redux.js.org/',
    author: 'Dan Abramov, Andrew Clark',
    num_comments: 2,
    points: 5,
    objectID: 2,
  },
  {
    title: 'Redux3',
    url: 'https://redux.js.org/',
    author: 'Dan Abramov, Andrew Clark',
    num_comments: 2,
    points: 5,
    objectID: 3,
  },
  {
    title: 'Redux4',
    url: 'https://redux.js.org/',
    author: 'Dan Abramov, Andrew Clark',
    num_comments: 2,
    points: 5,
    objectID: 4,
  },
  {
    title: 'React2',
    url: 'https://reactjs.org/',
    author: 'Jordan Walke',
    num_comments: 3,
    points: 4,
    objectID: 5,
  },
  {
    title: 'React3',
    url: 'https://reactjs.org/',
    author: 'Jordan Walke',
    num_comments: 3,
    points: 4,
    objectID: 6,
  },
];

const ACTIONS = {
  STORIES_FETCH_INIT: 'STORIES_FETCH_INIT',
  STORIES_FETCH_SUCCESS: 'STORIES_FETCH_SUCCESS',
  STORIES_FETCH_FAILURE: 'STORIES_FETCH_FAILURE',
  REMOVE_STORY: 'REMOVE_STORY'
};

const getAsyncStories = () =>
  new Promise((resolve) =>
    setTimeout(
      () => resolve({ data: { stories: initialStories } }),
      2000
    )
  );
  
const useSemiPersistentState = (key, initialState) => {
    const [value, setValue] = React.useState(
      localStorage.getItem(key) || initialState
    );
  
    React.useEffect(() => {
      localStorage.setItem(key, value);
    }, [value, key]);
  
    return [value, setValue];
  };

const storiesReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.STORIES_FETCH_INIT:
      return {
        ...state,
        isLoading: true,
        isError: false,
      };
    case ACTIONS.STORIES_FETCH_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload,
      };
    case ACTIONS.STORIES_FETCH_FAILURE:
      return {
        ...state,
        isLoading: false,
        isError: true,
      };
    case ACTIONS.REMOVE_STORY:
      return {
        ...state,
        data: state.data.filter(
          (story) => action.payload.objectID !== story.objectID
        ),
      };
    default:
      throw new Error();
  }
};

const App = () => {
 
  const [searchTerm, setSearchTerm] = useSemiPersistentState(
    'search',
    'React'
  );

  const [stories, dispatchStories] = React.useReducer(
    storiesReducer,
    { data: [], isLoading: false, isError: false }
  );

  React.useEffect(() => {
    dispatchStories({ type: ACTIONS.STORIES_FETCH_INIT });

    getAsyncStories()
      .then((result) => {
        dispatchStories({
          type: ACTIONS.STORIES_FETCH_SUCCESS,
          payload: result.data.stories,
        });
      })
      .catch(() =>
        dispatchStories({ type: ACTIONS.STORIES_FETCH_FAILURE })
      );
  }, []);

  const handleRemoveStory = (item) => {
    dispatchStories({
      type: ACTIONS.REMOVE_STORY,
      payload: item,
    });
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const searchedStories = stories.data.filter((story) =>
    story.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return(
    <div>
      <h1>My Hacker Stories</h1>
      <InputWithLabel
        id='search'
        value={searchTerm}
        isFocused
        onInputChanged={handleSearch}>
          <strong>Search:</strong>
      </InputWithLabel>
      <hr />
      {stories.isError && <p>something went wrong ...</p>}
      {stories.isLoading ? (
        <p>Loading ...</p>
      ) : (
        <List list={searchedStories}
          onRemoveItem={handleRemoveStory} />
      )}
    </div>
  );
};

const List = ({list, onRemoveItem}) => (
  <ul>
    {list.map((item) =>
      (<Item item={item} onRemoveItem={onRemoveItem} />)
    )}
  </ul>
);

const InputWithLabel = ({ id, value, type = 'text', onInputChanged, children, isFocused }) => {
  const inputRef = React.useRef();

  React.useEffect(() => {
    if (isFocused && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isFocused]);

  return (
    <>
      <label htmlFor={id}>{children}</label>
      &nbsp;
      <input ref={inputRef} id={id} type={type} onChange={onInputChanged} value={value}/>
    </>
  )
};

const Item = ({ item, onRemoveItem }) => (
  <li>
    <span>
      <a href={item.url}>{item.title}</a>
    </span>
    <span> {item.author}, </span>
    <span>{item.num_comments}, </span>
    <span>{item.points} </span>
    <span><button onClick={() => onRemoveItem(item)}>Dismiss</button></span>
  </li>
);

export default App;

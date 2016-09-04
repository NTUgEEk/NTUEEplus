const reducer = (state = { user: _server_user_ }, action) => {
  switch (action.type) {
    case 'SET_USER':
      return {
        user: action.user,
      };

    default:
      return state;
  }
};

export default reducer;

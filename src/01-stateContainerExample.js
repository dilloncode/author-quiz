import ReactDOM from 'react-dom';

const update = (model = { running: false, time: 0}, intent) => {
	const updates = {
  	'START': (model) => Object.assign(model, {running: true}),
    'STOP': (model) => Object.assign(model, {running: false}),
    'TICK': (model) => Object.assign(model, {time: model.time + (model.running ? 1 : 0)}),
  }
  return (updates[intent] || (() => model))(model);
}

let view = (m) => {
	let minutes = Math.floor(m.time / 60);
  let seconds = m.time - (minutes * 60);
  let secondsFormatted = `${seconds < 10 ? '0' : ''}${seconds}`
  let handler = (event) => {
  	container.dispatch(m.running ? 'STOP' : 'START');
  };
  
  return <div>
  	<p>{minutes}:{secondsFormatted}</p>
    <button onClick={handler}>{m.running ? 'Stop' : 'Start'}</button>
  </div>;
}

const createStore = (reducer) => {
	let internalState;
  let handlers = [];
	return {
  	dispatch: (intent) => {
    	internalState = reducer(internalState, intent);
      handlers.forEach(h => h());
    },
    subscribe: (handler) => {
    	handlers.push(handler);
    },
    getState: () => internalState
  }
};

let container = createStore(update);

const render = () => {
  ReactDOM.render(view(container.getState()), document.getElementById('root'));
};

container.subscribe(render);

setInterval(() => {
	container.dispatch('TICK');
}, 1000);
import SignInFormContainer from './js/SignInFormContainer';
// import registerServiceWorker from './registerServiceWorker';

// import './scss/styles.scss';

document.addEventListener('DOMContentLoaded', () => {

    ReactDOM.hydrate(
        <SignInFormContainer />,
        document.getElementsByClassName('signin-form-wrapper')[0]
    );

});

if (process.env.NODE_ENV !== 'production') {
    module.hot.accept();
}
// registerServiceWorker();

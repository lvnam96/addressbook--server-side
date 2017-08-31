import React from 'react';
import PropTypes from 'prop-types';

const MenuBar = function (props) {
    return (
        <footer className="sticky-nav">
            <ul className="sort-sub-nav translatedDown200">
                <li className="sort-sub-nav__item--presentState">Current WEEK</li>
                <li>Current MONTH</li>
                <li>Display ALL</li>
            </ul>
            <input style={{display: 'none'}} type="file" id="inptFileBtn" accept=".txt"
                onChange={props.onUploadFile} />
            <ul className="backup-restore-sub-nav translatedDown100">
                <li id="bckpDataBtn" onClick={props.onClickBackup} title="Save current data into a text file">Backup</li>
                <li id="rstrDataBtn" onClick={props.onClickRestore} title="Replace current data by the new one in your backup file">Restore</li>
            </ul>
            <nav className="main-nav">
                <div className="main-nav__item"><i className="fa fa-bars"></i></div>
                <div className="main-nav__item" title="Long-press this button to delete everything"
                    onMouseDown={props.onSetTimer}
                    onMouseUp={props.onClearTimer}
                    onTouchStart={props.onSetTimer}
                    onTouchEnd={props.onClearTimer}><i className="fa fa-trash-o"></i></div>
                <div className="main-nav__item" onClick={props.onClickOnBackupMenu}><i className="fa fa-files-o"></i></div>
                <div className="main-nav__item" onClick={props.onClickAddMenu}><i className="fa fa-plus"></i></div>
            </nav>
        </footer>
    );
};
MenuBar.propTypes = {
    onSetTimer: PropTypes.func.isRequired,
    onClearTimer: PropTypes.func.isRequired,
    onClickOnBackupMenu: PropTypes.func.isRequired,
    onClickBackup: PropTypes.func.isRequired,
    onClickRestore: PropTypes.func.isRequired,
    onUploadFile: PropTypes.func.isRequired,
    onClickAddMenu: PropTypes.func.isRequired
};

export default MenuBar;

import {useState} from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';

import ModalForm from '../../layouts/modal-wrapper/ModalForm';
import EditTaskForm from '../edit-task-form/EditTaskForm';

/*css*/
import style from "./TaskCard.module.css";



const KebabMenu= ({task, tasks,getOptions}) => {

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const options = getOptions(task,tasks)

  return (
    <div >
      <button
        aria-label="more"
        id="long-button"
        aria-controls={open ? 'long-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        onClick={handleClick}
        className={style.kebabMenu}
      >
        <MoreVertIcon fontSize='inherit'/>
      </button>
      <Menu
        id="long-menu"
        anchorEl={anchorEl}
        anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
        open={open}
        onClose={handleClose}
      >
        {options.map((option) => (
          <MenuItem
            key={option.id}
            onClick={() => {
              option.func();
              handleClose();
            }}
          >
            {option.name}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}

export default KebabMenu;

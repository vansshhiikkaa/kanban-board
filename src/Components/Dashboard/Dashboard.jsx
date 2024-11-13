import React from 'react'
import {useState, useEffect} from 'react'
import "./Dashboard.css"
import List from '../List/List'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import AddIcon from '@mui/icons-material/Add';
import InfoIcon from '@mui/icons-material/Info';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
// imparting required img
import NoPriorityIcon from './No-priority.svg';
import UrgentIcon from './SVG - Urgent Priority colour.svg';
import HighPriorityIcon from './Img - High Priority.svg';
import MediumPriorityIcon from './Img - Medium Priority.svg';
import LowPriorityIcon from './Img - Low Priority.svg';

import ToDoIcon from './To-do.svg';
import InProgressIcon from './in-progress.svg';
import BacklogIcon from './Backlog.svg';
import DoneIcon from './Done.svg';
import CancelledIcon from './Cancelled.svg';

function Dashboard({statuses, priorities, priorityScores, grouping, ordering}) {
    const [isLoading, setLoading] = useState(true);
    const [data, setData] = useState({"tickets": [],
        "users": []  
    })

    // fetch data from API
    useEffect(() => {
        fetch("https://api.quicksell.co/v1/internal/frontend-assignment")
        .then(response => {
          if(response.ok) {
            return response.json();
          }
          throw response
        })
        .then(response => {
          setData(response)
          setLoading(false)
        })
        .catch(error => {
          console.log(error)
        })
      }, [])

    // state variable to hold currently grouped and ordered lists - array of lists
    const [ticketMap, setTicketMap] = useState([])

    // comparator function to order tickets on title in lexiographic ascending order
    function cmpTitle(a, b) {
        return a.title.localeCompare(b.title);
    }

    // comparator function to order objects on priority in descending order
    function cmpPriority(a, b) {
        return b.priority - a.priority;
    }

    // group data on status and order on title
    let statusTicketMapTitle = () => {
        let obj = []
        statuses.forEach(status => {
            let tmp = [];
            data['tickets'].forEach(ticket => {
                if(status === ticket.status) tmp.push(ticket)
            })
            tmp.sort(cmpTitle)
            obj.push(tmp)
        });
        setTicketMap(obj)
    }

    // group data on status and order on priority
    let statusTicketMapPriority = () => {
        let obj = []
        statuses.forEach(status => {
            let tmp = [];
            data['tickets'].forEach(ticket => {
                if(status === ticket.status) tmp.push(ticket)
            })
            tmp.sort(cmpPriority)
            obj.push(tmp)
        });
        setTicketMap(obj)
    }

    // group data on users and order on title
    let userTicketMapTitle = () => {
        let obj = []
        data['users'].forEach(user => {
            let tmp = [];
            data['tickets'].forEach(ticket => {
                if(user.id === ticket.userId) tmp.push(ticket)
            })
            tmp.sort(cmpTitle)
            obj.push(tmp)
        });
        setTicketMap(obj)
    }

    // group data on users and order on priority
    let userTicketMapPriority = () => {
        let obj = []
        data['users'].forEach(user => {
            let tmp = [];
            data['tickets'].forEach(ticket => {
                if(user.id === ticket.userId) tmp.push(ticket)
            })
            tmp.sort(cmpPriority)
            obj.push(tmp)
        });
        setTicketMap(obj)
    }

    // group data on priority and order on title
    let priorityTicketMapTitle = () => {
        let obj = []
        priorityScores.forEach(priority => {
            let tmp = [];
            data['tickets'].forEach(ticket => {
                if(priority === ticket.priority) tmp.push(ticket)
            })
            tmp.sort(cmpTitle)
            obj.push(tmp)
        });
        setTicketMap(obj)
    }

    // group data on priority and order on priority
    let priorityTicketMapPriority = () => {
        let obj = []
        priorityScores.forEach(priority => {
            let tmp = [];
            data['tickets'].forEach(ticket => {
                if(priority === ticket.priority) tmp.push(ticket)
            })
            tmp.sort(cmpPriority)
            obj.push(tmp)
        });
        setTicketMap(obj)
    }

    // re-render data when user chooses an option in the navbar dropdown
    useEffect(() => {
        if(grouping === 'Status' && ordering === 'Priority') {
            statusTicketMapPriority()
        } else if(grouping === 'Status' && ordering === 'Title') {
            statusTicketMapTitle()
        } else if(grouping === 'User' && ordering === 'Priority') {
            userTicketMapPriority()
        } else if(grouping === 'User' && ordering === 'Title') {
            userTicketMapTitle()
        } else if(grouping === 'Priority' && ordering === 'Priority') {
            priorityTicketMapPriority()
        } else if(grouping === 'Priority' && ordering === 'Title') {
            priorityTicketMapTitle()
        }
    }, [grouping, ordering])

    // to set the initial view of dashboard on first render after the data from the API has been fetched
    useEffect(() => {
        // statusTicketMapTitle()
        if(grouping === 'Status' && ordering === 'Priority') {
            statusTicketMapPriority()
        } else if(grouping === 'Status' && ordering === 'Title') {
            statusTicketMapTitle()
        } else if(grouping === 'User' && ordering === 'Priority') {
            userTicketMapPriority()
        } else if(grouping === 'User' && ordering === 'Title') {
            userTicketMapTitle()
        } else if(grouping === 'Priority' && ordering === 'Priority') {
            priorityTicketMapPriority()
        } else if(grouping === 'Priority' && ordering === 'Title') {
            priorityTicketMapTitle()
        }
    }, [data])
    
    // to deal with async API call. while the data has not been fetched, loading is displayed
    if (isLoading) {
        return <div className="App">Loading...</div>;
    }
    const priorityIcons = [
        NoPriorityIcon,  // No Priority
        UrgentIcon,      // Urgent
        HighPriorityIcon, // High
        MediumPriorityIcon, // Medium
        LowPriorityIcon  // Low
    ];
    const statusIcons = [
    BacklogIcon,
    ToDoIcon,
    InProgressIcon,
    DoneIcon,
    CancelledIcon
];
const userColors = ['#ff5dad', '#f6bf36', '#0affbf', '#0bf6ff', '#bd76ff', '#ffffff', '#ffffff'];

// Hash function to map userId to a color
  const getUserColor = (userId) => {
    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
      hash = userId.charCodeAt(i) + ((hash << 5) - hash);
    }
    hash = Math.abs(hash);
    return userColors[hash % userColors.length];
  };

  return (
    <div className='dashboard-main'>
        {grouping === "Status" ? 
            ticketMap.map((ticketList, key) => {
                return (
                <div className='dashboard-list'>
                    <div className='dashboard-list-header-controls'>
                        <div className='dashboard-list-header-controls-info'>
                            <img src={statusIcons[key]} alt={`${statuses[key]} icon`} className="status-icon"/>
                            <b><p className='dashboard-list-header'>{statuses[key]}</p></b>
                            <div className='dashboard-list-items-count'>{ticketList.length}</div>
                        </div>
                        {ticketList.length !== 0 && <div>
                            <AddIcon sx={{ color: "#808080"}}/>
                            <MoreHorizIcon sx={{ color: "#808080"}}/>
                        </div>}
                    </div>
                    <List key={key} ticketList={ticketList} />
                </div>
                )
            })
        :
        grouping === 'User' ? 
            ticketMap.map((ticketList, key) => {
                return (
                <div className='dashboard-list'>
                    <div className='dashboard-list-header-controls'>
                            <div className='dashboard-list-header-controls-info'>
                                <AccountCircleIcon sx={{ color: getUserColor(data.users[key].id) }}/>
                                <b><p className='dashboard-list-header'>{data['users'][key].name}</p></b>
                                <div className='dashboard-list-items-count'>{ticketList.length}</div>
                            </div>
                            {ticketList.length !== 0 && <div>
                                <AddIcon sx={{ color: "#808080"}}/>
                                <MoreHorizIcon sx={{ color: "#808080"}}/>
                            </div>}
                        </div>
                    <List key={key} ticketList={ticketList} />
                </div>
                )
            })
        :
        grouping === 'Priority' ? 
            ticketMap.map((ticketList, key) => {
                return (
                <div className='dashboard-list'>
                    <div className='dashboard-list-header-controls'>
                            <div className='dashboard-list-header-controls-info'>
                                <img src={priorityIcons[key]} alt={`${priorities[key]} icon`} className="priority-icon"/>
                                <b><p className='dashboard-list-header'>{priorities[key]}</p></b>
                                <div className='dashboard-list-items-count'>{ticketList.length}</div>
                            </div>
                            {ticketList.length !== 0 && <div>
                                <AddIcon sx={{ color: "#808080"}}/>
                                <MoreHorizIcon sx={{ color: "#808080"}}/>
                            </div>}
                        </div>
                    <List key={key} ticketList={ticketList} />
                </div>
                )
            })
        :
        (<span></span>)
        }
    </div>
  )
}

export default Dashboard

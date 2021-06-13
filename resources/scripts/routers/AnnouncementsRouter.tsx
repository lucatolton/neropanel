import React from 'react';
import { NavLink, Route, RouteComponentProps, Switch } from 'react-router-dom';
import NavigationBar from '@/components/NavigationBar';
import NotFound from '@/components/elements/ScreenBlock';
import TransitionRouter from '@/TransitionRouter';
import SubNavigation from '@/components/elements/SubNavigation';
import AnnouncementsContainer from '@/components/dashboard/announcements/AnnouncementsContainer';
import ViewAnnouncement from '@/components/dashboard/announcements/ViewAnnouncement';

export default ({ location }: RouteComponentProps) => (
    <>
        <NavigationBar/>
        {location.pathname.startsWith('/announcements') &&
        <SubNavigation>
            <div>
                <NavLink to={'/announcements'} exact>All Announcements</NavLink>
            </div>
        </SubNavigation>
        }
        <TransitionRouter>
            <Switch location={location}>
                <Route path={'/announcements'} component={AnnouncementsContainer} exact/>
                <Route path={'/announcements/:id'} component={ViewAnnouncement} exact/>
                <Route path={'*'} component={NotFound}/>
            </Switch>
        </TransitionRouter>
    </>
);

import React, { useEffect, useState } from 'react';
import { Server } from '@/api/server/getServer';
import getServers from '@/api/getServers';
import ServerRow from '@/components/dashboard/ServerRow';
import Spinner from '@/components/elements/Spinner';
import PageContentBlock from '@/components/elements/PageContentBlock';
import useFlash from '@/plugins/useFlash';
import { usePersistedState } from '@/plugins/usePersistedState';
import Switch from '@/components/elements/Switch';
import tw from 'twin.macro';
import useSWR from 'swr';
import { PaginatedResult } from '@/api/http';
import Pagination from '@/components/elements/Pagination';
import { useLocation } from 'react-router-dom';
import ContentBox from '@/components/elements/ContentBox';
import { State, useStoreState } from 'easy-peasy';
import { ApplicationStore } from '@/state';

export default () => {
    const user = useStoreState((state: State<ApplicationStore>) => state.user.data);
    const { search } = useLocation();
    const defaultPage = Number(new URLSearchParams(search).get('page') || '1');

    const [ page, setPage ] = useState((!isNaN(defaultPage) && defaultPage > 0) ? defaultPage : 1);
    const { clearFlashes, clearAndAddHttpError } = useFlash();
    const uuid = useStoreState(state => state.user.data!.uuid);
    const rootAdmin = useStoreState(state => state.user.data!.rootAdmin);
    const [ showOnlyAdmin, setShowOnlyAdmin ] = usePersistedState(`${uuid}:show_all_servers`, false);

    const { data: servers, error } = useSWR<PaginatedResult<Server>>(
        [ '/api/client/servers', showOnlyAdmin, page ],
        () => getServers({ page, type: showOnlyAdmin ? 'admin' : undefined }),
    );

    useEffect(() => {
        if (!servers) return;
        if (servers.pagination.currentPage > 1 && !servers.items.length) {
            setPage(1);
        }
    }, [ servers?.pagination.currentPage ]);

    useEffect(() => {
        // Don't use react-router to handle changing this part of the URL, otherwise it
        // triggers a needless re-render. We just want to track this in the URL incase the
        // user refreshes the page.
        window.history.replaceState(null, document.title, `/${page <= 1 ? '' : `?page=${page}`}`);
    }, [ page ]);

    useEffect(() => {
        if (error) clearAndAddHttpError({ key: 'dashboard', error });
        if (!error) clearFlashes('dashboard');
    }, [ error ]);

    return (
        <PageContentBlock title={'Dashboard'} showFlashKey={'dashboard'}>
            <p css={tw`text-center text-neutral-100 my-2`}>
                <span css={tw`text-base`}>Welcome back, {user!.username}!</span>
            </p>
            <ContentBox title={'Servers'}>
                <div css={tw`mb-0 sm:mb-6`}>
                    {rootAdmin &&
                        <div css={tw`mb-2 flex justify-end items-center`}>
                            <Switch
                                name={'show_all_servers'}
                                defaultChecked={showOnlyAdmin}
                                onChange={() => setShowOnlyAdmin(s => !s)}
                            />
                        </div>
                    }
                    {!servers ?
                        <Spinner centered size={'large'}/>
                        :
                        <Pagination data={servers} onPageSelect={setPage}>
                            {({ items }) => (
                                items.length > 0 ?
                                    items.map((server, index) => (
                                        <ServerRow
                                            key={server.uuid}
                                            server={server}
                                            css={index > 0 ? tw`mt-2` : undefined}
                                        />
                                    ))
                                    :
                                    <p css={tw`text-center text-sm text-neutral-400`}>
                                        Seems quite empty here...
                                    </p>
                            )}
                        </Pagination>
                    }
                </div>
            </ContentBox>
        </PageContentBlock>
    );
};

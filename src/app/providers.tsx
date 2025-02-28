'use client';

import React from "react";

import { Content, Theme } from '@carbon/react';

import {Header} from "@/components";

/*
-<Route path='/solutions' exact element={<SolutionsView user={this.props.user} addNotification={this.props.addNotification} />} />
-<Route path='/solutions/user' exact element={<SolutionsView user={this.props.user} addNotification={this.props.addNotification} isUser />} />
-<Route path='/solutions/new' exact element={<CreateSolutionView user={this.props.user} addNotification={this.props.addNotification} />} />
-<Route path={'/solutions/:id'} element={<SolutionDetails user={this.props.user} addNotification={this.props.addNotification}/>} />
-<Route path='/boms/user' exact element={<ArchitectureView user={this.props.user} addNotification={this.props.addNotification} isUser/>} />
-<Route path='/boms/infrastructure' exact element={<ArchitectureView user={this.props.user} addNotification={this.props.addNotification} isInfra/>} />
-<Route path='/boms/software' exact element={<ArchitectureView user={this.props.user} addNotification={this.props.addNotification} isSoftware/>} />
-<Route path='/boms/:bomId' element={<BomDetails user={this.props.user} addNotification={this.props.addNotification}/>} />
-<Route path='/services/:serviceId' element={<ServiceDetails addNotification={this.props.addNotification} />} />
-<Route path='/controls' element={<ControlsView user={this.props.user} addNotification={this.props.addNotification} />} />
-<Route path='/controls/:controlId' element={<ControlDetails user={this.props.user} addNotification={this.props.addNotification} />} />
-<Route path='/mapping' element={<MappingView  user={this.props.user} addNotification={this.props.addNotification} />} />
-<Route path='/nists' element={<NistView user={this.props.user}  addNotification={this.props.addNotification} />} />
-<Route path='/nists/:number' element={<NistDetails user={this.props.user} addNotification={this.props.addNotification} />} />
 */

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <div>
            <Theme theme="g100">
                <Header />
                <Content>{children}</Content>
            </Theme>
        </div>
    );
}
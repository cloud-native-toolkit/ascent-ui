"use client"

import {useAtomValue, useSetAtom} from "jotai";
import Link from "next/link";
import {useRouter} from "next/navigation";
import {useState} from "react";
import SlidingPane from "react-sliding-pane";
import {Button, Column, FlexGrid, OverflowMenu, OverflowMenuItem, Row, Tile} from "@carbon/react";
import {Add, Close} from "@carbon/icons-react";

import {
    currentSolutionAtom,
    currentSolutionAtomLoadable,
    dataDetailsAtom,
    isDuplicateAtom,
    notificationsAtom,
    updateModalAtom,
    useFilteredSolutions
} from "@/atoms";
import {SolutionModal, ValidateModal} from "@/components";
import {AddNotification, newNotification, Solution, User} from "@/models";
import {solutionsApi} from "@/services";

export const BaseSolution = ({user}: {user?: User}) => {
    const setCurrentSolution = useSetAtom(currentSolutionAtom);
    const currentSolutionLoadable = useAtomValue(currentSolutionAtomLoadable)
    const updateModal = useAtomValue(updateModalAtom);
    const isDuplicate = useAtomValue(isDuplicateAtom);
    const dataDetails = useAtomValue(dataDetailsAtom);
    const addNotificationAtom = useSetAtom(notificationsAtom)
    const {data: solutions} = useFilteredSolutions(user?.email, user?.config)
    const [showForm, setShowForm] = useState(false);
    const [showValidate, setShowValidate] = useState(false);
    const router = useRouter();

    const currentSolution: Solution | undefined = currentSolutionLoadable.state === 'hasData' ? currentSolutionLoadable.data : undefined;

    const addNotification: AddNotification = (severity: string, message: string, detail: string) => {
        addNotificationAtom(newNotification(severity, message, detail))
    }

    const deleteSolution = async (solutionId: string) => {
        addNotification('info', 'Deleting', `Solution ${solutionId} id being deleted...`);

        try {
            await solutionsApi().delete(solutionId);

            addNotification('success', 'OK', `Solution ${solutionId} deleted successfully.`);
            setShowValidate(false);
            setCurrentSolution(undefined).catch(error => console.log('Error setting current solution.', error));
        } catch (error) {
            addNotification('error', 'Error', `Error while deleting solution ${solutionId}, check the logs for details.`);
            console.log('Error deleting solution: ' + solutionId, error);
        }
    }

    const downloadTerraform = async (solution: Solution) => {
        if (!solution) {
            addNotification("error", "Error", "Cannot download Automation at this time.");
            return
        }

        addNotification("info", "BUILDING", "Building automation...");

        try {
            const blob = await solutionsApi().getSolutionAutomation(solution.id);

            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${solution.name?.toLowerCase()?.replace(/[ /\\_?;.=:,+]/g, '-')}-automation.zip`;
            a.click();
        } catch (error) {
            addNotification("error", "Error", "Error while downloading automation, check the logs for details.");
            console.log("Error downloading automation: " + solution.id, error);
        }
    }

    return (
        <FlexGrid className="solutions">
            <Row className="sol-page__row">
                <Column lg={{ span: 12 }}>
                    <h2>
                        {`${user ? 'Custom' : 'Public'} Solutions`}
                        {user?.roles?.includes("editor") ? <div className="create-buttons"><Button
                            size="sm"
                            onClick={() => () => router.push('/solutions/new') }
                            renderIcon={Add} >
                            Create Solution
                        </Button><OverflowMenu flipped light>
                            <OverflowMenuItem
                                itemText="Create (Manual)"
                                onClick={() => setShowForm(true)} />
                        </OverflowMenu></div> : <></>}
                    </h2>
                    <br></br>
                </Column>
            </Row>

            <div className="tile-group">
                {(solutions || []).map((solution) => (
                    <Tile key={solution.id}>
                        <div className="tile-header">
                            <Link href={`/solutions/${solution.id}`} className="tile-title">
                                <h5>{solution.name}</h5>
                            </Link>

                            <OverflowMenu flipped light>
                                <OverflowMenuItem
                                    itemText="Download"
                                    onClick={() => downloadTerraform(solution)} />
                                {user?.role === "admin" || (user?.roles?.includes('editor') && user) ?
                                    <OverflowMenuItem hasDivider isDelete itemText="Delete" onClick={() => {
                                        setShowValidate(true);
                                        setCurrentSolution(solution).catch(error => console.log('Error setting current solution.', error));
                                    }} /> : <></>}
                            </OverflowMenu>
                        </div>
                        {/* <h6>{solution.id}</h6> */}
                        <div className="tile-desc">{solution.short_desc}</div>
                    </Tile>
                ))
                }</div>

            <SlidingPane
                closeIcon={<Close />}
                title="Add a Solution"
                className="sliding-pane"
                isOpen={showForm}
                width="600px"
                onRequestClose={() => setShowForm(false)}
            >
                <SolutionModal
                    show={showForm}
                    handleClose={() => setShowForm(false)}
                    isUpdate={updateModal}
                    data={dataDetails}
                    toast={addNotification}
                    isDuplicate={isDuplicate}
                    user={user}
                />
            </SlidingPane>

            {showValidate && currentSolution &&
              <ValidateModal
                danger={true}
                submitText="Delete"
                heading="Delete Solution"
                message={`You are about to remove solution "${currentSolution.name ?? currentSolution.id}". This action cannot be undone. This will remove the solution record, as well as all associated files. If you are sure, type "${currentSolution.id}" and click Delete to confirm deletion.`}
                show={showValidate}
                inputRequired={currentSolution.id}
                onClose={() => {
                    setShowValidate(false);
                    setCurrentSolution(undefined).catch(error => console.log('Error setting current solution.', error));
                }}
                onRequestSubmit={() => deleteSolution(currentSolution.id)}
                onSecondarySubmit={() => {
                    setShowValidate(false);
                    setCurrentSolution(undefined).catch(error => console.log('Error setting current solution.', error));
                }} />
            }
        </FlexGrid>
    );
}

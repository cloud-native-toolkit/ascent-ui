"use client"

import {useAtom} from "jotai";

import {storageAtom, storageOptionsAtom} from "@/atoms";
import {Icon} from "@/components";
import {Bom} from "@/models";

import styles from "../../page.module.scss";

interface InfraStorageStepProps {
    visible: boolean;
}

export const InfraStorageStep = ({visible}: InfraStorageStepProps) => {
    const [{data: storageOptions}] = useAtom(storageOptionsAtom);
    const [selectedStorage, setSelectedStorage] = useAtom(storageAtom);

    if (!visible) return (<></>);

    return (
        <div>
            <div className={styles.selectionSet}>
                <form className={styles.plan}>
                    <div className={styles.title}>
                        Now you have selected your reference architecture you will require some file storage for your IBM Software
                    </div>
                    {
                        storageOptions?.length ?
                            storageOptions.map((storage: Bom) => (

                                <label className={`${styles.plan} ${styles.completePlan}`} htmlFor={storage.name} key={storage.name}>
                                    <input type="radio" name={storage.name} id={storage.name}
                                           checked={!!(selectedStorage?.name && selectedStorage?.name === storage.name)}
                                           onClick={() => setSelectedStorage(storage) } />
                                    <div className={styles.planContent}>
                                        <Icon src={storage.iconUrl} alt={storage.displayName ?? storage.name} />

                                        <div className={styles.planDetails}>
                                            <span>{storage.displayName ?? storage.name}</span>
                                            <p>{storage.description}</p>
                                        </div>
                                    </div>
                                </label>

                            )) : <p>No Storage options</p>
                    }
                </form>
            </div>
        </div>
    );
};
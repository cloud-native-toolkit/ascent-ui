"use client"

import React, {ReactNode} from 'react';
import "./info.component.scss";

// Take in a phrase and separate the third word in an array
function createArrayFromPhrase(phrase: string = ''): string[] {
    const splitPhrase: string[] = phrase.split(' ');
    if (splitPhrase.length < 2) return splitPhrase;

    const thirdWord: string = splitPhrase.pop() as string;

    return [splitPhrase.join(' '), thirdWord];
}

export const InfoSection = ({children, className}: {heading: string, children: ReactNode, className: string}) => (
    <section className={`bx--row ${className} info-section`}>
        {children}
    </section>
);

export const InfoCard = ({heading, body, icon}: {heading: string, body: string, icon: ReactNode}) => {
    const splitHeading = createArrayFromPhrase(heading);

    return (
        <div className="info-card bx--col-md-3 bx--col-lg-3 bx--col-xlg-3" style={{padding: '1rem'}}>
            <h4 className="info-card__heading">
                {`${splitHeading[0]} `}
                <strong>{splitHeading[1]}</strong>
            </h4>
            <p className="info-card__body">{body}</p>
            {icon}
        </div>
    );
};

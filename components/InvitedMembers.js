import NamePicDel from "./NamePicDel"

export default function InvitedMembers({invites, removeEmail}) {
    
    return (
        <>
        {
            invites.length > 0 && (
                invites.map((invite) => (
                    <NamePicDel memberEmail = {invite}
                    deleteEmail = {removeEmail}
                    isInvite = {false}
                    key = {invite}
               />
                ))
            )
        }
        </>
    )
}
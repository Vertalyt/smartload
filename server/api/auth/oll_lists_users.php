<?php
// oll_lists_users.php

function ollUserLogin($ldap_username, $ldap__password)
{

    try {
        $ldap_conn = ldap_connect("ldap://10.100.10.1");
        ldap_set_option($ldap_conn, LDAP_OPT_PROTOCOL_VERSION, 3);

        if ($ldap_conn) {
            // Добавляем префикс, если его нет
            if (strpos($ldap_username, 'xatanet\\') !== 0) {
                $ad_user = 'xatanet\\' . $ldap_username;
            }

            $ldap_bind = ldap_bind($ldap_conn, $ad_user, $ldap__password);

            if ($ldap_bind) {
                // Ваш код обработки успешной аутентификации
                $parts = explode('\\', $ad_user);

                if (count($parts) === 2) {
                    // Обработка данных

                    $xatanet_catalog = "OU=XataNet,DC=xatanet,DC=ua";
                    $servers_admins_catalog = "OU=Server's & Admin's,DC=xatanet,DC=ua";


                    $search_filter = "(&(objectcategory=person)(objectclass=user))";
                    $attributes = array("mail", "samaccountname", "telephonenumber", "homephone", "mobile", "name");


                    // Поиск в xatanet_catalog
                    $result_xatanet = ldap_search($ldap_conn, $xatanet_catalog, $search_filter, $attributes);
                    $oll_users_xatanet = ldap_get_entries($ldap_conn, $result_xatanet);

                    // Поиск в servers_admins_catalog
                    $result_servers_admins = ldap_search($ldap_conn, $servers_admins_catalog, $search_filter, $attributes);
                    $oll_users_servers_admins = ldap_get_entries($ldap_conn, $result_servers_admins);

                    // Объединение результатов поиска
                    $oll_users = array_merge($oll_users_xatanet, $oll_users_servers_admins);

                    ldap_unbind($ldap_conn);
                    return $oll_users;
                }
            }
        }
    } catch (Exception $e) {
        // В случае ошибки
        error_log("Error: " . $e->getMessage());
    }

    return false;
}

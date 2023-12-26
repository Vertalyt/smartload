<?php
// auth_functions.php

function authenticateUser($ad_user, $ad_password) {

    try {
        $ldap_conn = ldap_connect("ldap://10.100.10.1");
        ldap_set_option($ldap_conn, LDAP_OPT_PROTOCOL_VERSION, 3);

        if ($ldap_conn) {
            // Добавляем префикс, если его нет
            if (strpos($ad_user, 'xatanet\\') !== 0) {
                $ad_user = 'xatanet\\' . $ad_user;
            }

            $ldap_bind = ldap_bind($ldap_conn, $ad_user, $ad_password);

            if ($ldap_bind) {
                // Ваш код обработки успешной аутентификации
                $parts = explode('\\', $ad_user);

                if (count($parts) === 2) {
                    // Обработка данных
                    $username = $parts[1];

                    $xatanet_catalog = "OU=XataNet,DC=xatanet,DC=ua";
                    $servers_admins_catalog = "OU=Server's & Admin's,DC=xatanet,DC=ua";
                    $common_catalog = "DC=xatanet,DC=ua";

                    $search_filter = "(sAMAccountName=$username)";
                    $attributes = array("displayname", "mail", "samaccountname");

                    // Ищем в каталоге XataNet
                    $result = ldap_search($ldap_conn, $xatanet_catalog, $search_filter, $attributes);
                    $entry = ldap_get_entries($ldap_conn, $result);

                    if ($entry['count'] === 0) {
                        // Если пользователь не найден в первом каталоге, ищем в Server's & Admin's
                        $result = ldap_search($ldap_conn, $servers_admins_catalog, $search_filter, $attributes);
                        $entry = ldap_get_entries($ldap_conn, $result);
                    }

                    if ($entry['count'] === 0) {
                        // Если пользователь не найден во втором каталоге, ищем в общем каталоге xatanet
                        $result = ldap_search($ldap_conn, $common_catalog, $search_filter, $attributes);
                        $entry = ldap_get_entries($ldap_conn, $result);
                    }

                    ldap_unbind($ldap_conn);
                    return $entry;
                } 
            }
        }
    } catch (Exception $e) {
        // В случае ошибки
        error_log("Error: " . $e->getMessage());
    }

    return false;
}
?>

source .env
export UBUNTU_PASS
ansible-playbook -i inventory.yaml playbook.yaml
